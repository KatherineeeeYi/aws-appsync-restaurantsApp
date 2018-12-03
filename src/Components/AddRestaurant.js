import React, { Component } from "react";
import { Link } from "react-router-dom";

import { v4 as uuid } from "uuid";
import { graphql } from "react-apollo";
import ListRestaurants from "../queries/ListRestaurants";
import GetRestaurant from "../queries/GetRestaurant";
import CreateRestaurant from "../mutations/CreateRestaurant";

import moment from 'moment';


class AddRestaurant extends Component {

    static defaultProps = {
        createRestaurant: () => null,
    }

    state = {
        restaurant: {
            name: '',
            category: '',
            city: '',
            address: '',
        }
    };

    handleChange(field, { target: { value } }) {
        const { restaurant } = this.state;

        restaurant[field] = value;

        this.setState({ restaurant });
    }

    handleDateChange(field, value) {
        this.handleChange(field, { target: { value: value.format() } });
    }

    handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { createRestaurant, history } = this.props;
        const { restaurant } = this.state;

        await createRestaurant({ ...restaurant });

        history.push('/');
    }

    render() {
        const { restaurant } = this.state;

        return (
            <div className="ui container raised very padded segment">
                <h1 className="ui header">Create an restaurant</h1>
                <div className="ui form">
                    <div className="field required eight wide">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={restaurant.name} onChange={this.handleChange.bind(this, 'name')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" value={restaurant.category} onChange={this.handleChange.bind(this, 'category')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="city">city</label>
                        <textarea name="city" id="city" rows="10" value={restaurant.city}
                            onChange={this.handleChange.bind(this, 'city')}></textarea>
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="address">address</label>
                        <textarea name="address" id="address" rows="10" value={restaurant.address}
                            onChange={this.handleChange.bind(this, 'address')}></textarea>
                    </div>
                    <div className="ui buttons">
                        <Link to="/" className="ui button">Cancel</Link>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default graphql(
    CreateRestaurant,
    {
        props: (props) => ({
            createRestaurant: (restaurant) => {
                return props.mutate({
                    update: (proxy, { data: { createRestaurant } }) => {
                        // Update ListRestaurants
                        const query = ListRestaurants;
                        const data = proxy.readQuery({ query });

                        data.listRestaurants.items = [...data.listRestaurants.items.filter(e => e.id !== createRestaurant.id), createRestaurant];

                        proxy.writeQuery({ query, data });

                        // Create cache entry for QueryGetRestaurant
                        const query2 = GetRestaurant;
                        const variables = { id: createRestaurant.id };
                        const data2 = { getRestaurant: { ...createRestaurant } };

                        proxy.writeQuery({ query: query2, variables, data: data2 });
                    },
                    variables: restaurant,
                    optimisticResponse: () => ({
                        createRestaurant: {
                            ...restaurant, id: uuid(), __typename: 'Restaurant', comments: { __typename: 'CommentConnection', items: [] }
                        }
                    }),
                })
            }
        })
    }
)(AddRestaurant);
