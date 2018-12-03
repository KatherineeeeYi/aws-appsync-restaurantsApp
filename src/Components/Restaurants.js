import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import ListRestaurants from "../queries/ListRestaurants";
import DeleteRestaurant from "../mutations/DeleteRestaurant";

// import moment from "moment";

class Restaurants extends Component {

    state = {
        busy: false,
    }

    static defaultProps = {
        restaurants: [],
        deleteRestaurant: () => null,
    }

    async handleDeleteClick(restaurant, e) {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete restaurant ${restaurant.id}`)) {
            const { deleteRestaurant } = this.props;

            await deleteRestaurant(restaurant);
        }
    }

    handleSync = async () => {
        const { client } = this.props;
        const query = ListRestaurants;

        this.setState({ busy: true });

        await client.query({
            query,
            fetchPolicy: 'network-only',
        });

        this.setState({ busy: false });
    }

    renderRestaurant = (restaurant) => (
        <Link to={`/restaurant/${restaurant.id}`} className="card" key={restaurant.id}>
            <div className="content">
                <div className="header">{restaurant.name}</div>
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, restaurant)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    );

    render() {
        const { busy } = this.state;
        const { restaurants } = this.props;
        console.log('props:', this.props);

        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">All Restaurants</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/addRestaurant" className="new-restaurant content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new restaurant</p>
                        </Link>
                    </div>
                    {/*Display all the restaurants */}
                    {[].concat(restaurants).map(this.renderRestaurant)}
                </div>
            </div>
        );
    }

}

export default withApollo(compose(
    graphql(
        ListRestaurants,
        {
            options: {
                fetchPolicy: 'cache-first',
            },
            props: ({ data: { listRestaurants = { items: [] } } }) => ({
                restaurants: listRestaurants.items
            })
        }
    ),
    graphql(
        DeleteRestaurant,
        {
            options: {
                update: (proxy, { data: { deleteRestaurant } }) => {
                    const query = ListRestaurants;
                    const data = proxy.readQuery({ query });

                    data.listRestaurants.items = data.listRestaurants.items.filter(restaurant => restaurant.id !== deleteRestaurant.id);

                    proxy.writeQuery({ query, data });
                }
            },
            props: (props) => ({
                deleteRestaurant: (restaurant) => {
                    return props.mutate({
                        variables: { id: restaurant.id },
                        optimisticResponse: () => ({
                            deleteRestaurant: {
                                ...restaurant, __typename: 'Restaurant', comments: { __typename: 'CommentConnection', items: [] }
                            }
                        }),
                    });
                }
            })
        }
    )
)(Restaurants));
