import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import GetRestaurant from "../queries/GetRestaurant";
import RestaurantComments from "./RestaurantComments";

class ViewRestaurant extends Component {

    render() {
        const { restaurant, loading } = this.props;
        return (
            <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
                <div className="ui items">
                    <div className="item">
                        {restaurant && <div className="content">
                            <div className="header">{restaurant.name}</div>
                            <div className="category">{restaurant.category}</div>
                            <div className="extra"><i className="icon green map marker alternate"></i>{restaurant.city}</div>
                            <div className="comment-wrapper">
                                <RestaurantComments restaurantId={restaurant.id} comments={restaurant.comments} />
                            </div>
                        </div>}
                    </div>
                </div>
                <Link to="/" className="ui button">Back</Link>

            </div>
        );
    }

}

const ViewRestaurantWithData = graphql(
    GetRestaurant,
    {
        options: ({ match: { params: { id } } }) => ({
            variables: { id },
            fetchPolicy: 'cache-and-network',
        }),
        props: ({ data: { getRestaurant: restaurant, loading} }) => ({
            restaurant,
            loading,
        }),
    },
)(ViewRestaurant);

export default ViewRestaurantWithData;