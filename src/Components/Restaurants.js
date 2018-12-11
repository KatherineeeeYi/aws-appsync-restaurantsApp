import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { graphql, compose, withApollo } from 'react-apollo'
import ListRestaurants from '../queries/ListRestaurants'
import DeleteRestaurant from '../mutations/DeleteRestaurant'

class Restaurants extends Component {
  state = {
    busy: false
  }

  static defaultProps = {
    restaurants: [],
    deleteRestaurant: () => null
  }

  async handleDeleteClick (restaurant, e) {
    e.preventDefault()

    if (
      window.confirm(
        `Are you sure you want to delete restaurant ${restaurant.name}`
      )
    ) {
      const { deleteRestaurant } = this.props

      await deleteRestaurant(restaurant)
    }
  }

  handleSync = async () => {
    const { client } = this.props
    const query = ListRestaurants

    this.setState({ busy: true })

    await client.query({
      query,
      fetchPolicy: 'network-only'
    })

    this.setState({ busy: false })
  }

  renderRestaurant = restaurant => (
    <Link to={`/restaurant/${restaurant.id}`} className='grid' key={restaurant.id}>
      <div className='restaurant'>
        <div className='content name'>{restaurant.name}</div>
        <div className='content category'>{restaurant.category}</div>
        <div className='content city'>{restaurant.city}</div>
        <button className='right' onClick={this.handleDeleteClick.bind(this, restaurant)}>
          <i className='trash icon' />
        </button>
      </div>
    </Link>
  )

  render () {
    const { busy } = this.state
    const { restaurants } = this.props

    return (
      <div className="ui container raised very padded segment">
        <div className='ui clearing basic segment'>
          <h1 className='ui header left floated'><Link to='/'>Restaurants-To-Go</Link></h1>
          <button className='ui icon basic button button-right' onClick={this.handleSync} disabled={busy}>
            <i aria-hidden='true' className={`black sync alternate icon ${busy && 'loading'}`}/>
          </button>
          <button className='ui icon basic button button-right'>
            <Link to='/addRestaurant' className=''>
              <i className='icon add' />
                AddNew
            </Link>
        </button>
        </div>

        

        {/* Display all the restaurants */}
        <div className='ui padded grid'>
          <div className="white row">
            <div className="column">{[].concat(restaurants).map(this.renderRestaurant)}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default withApollo(
  compose(
    graphql(ListRestaurants, {
      options: {
        fetchPolicy: 'cache-first'
      },
      props: ({ data: { listRestaurants = { items: [] } } }) => ({
        restaurants: listRestaurants.items
      })
    }),
    graphql(DeleteRestaurant, {
      options: {
        update: (proxy, { data: { deleteRestaurant } }) => {
          const query = ListRestaurants
          const data = proxy.readQuery({ query })

          data.listRestaurants.items = data.listRestaurants.items.filter(
            restaurant => restaurant.id !== deleteRestaurant.id
          )

          proxy.writeQuery({ query, data })
        }
      },
      props: props => ({
        deleteRestaurant: restaurant => {
          return props.mutate({
            variables: { id: restaurant.id },
            optimisticResponse: () => ({
              deleteRestaurant: {
                ...restaurant,
                __typename: 'Restaurant',
                comments: { __typename: 'CommentConnection', items: [] }
              }
            })
          })
        }
      })
    })
  )(Restaurants)
)
