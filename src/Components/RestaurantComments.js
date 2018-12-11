import React, { Component } from "react";
import { graphql } from "react-apollo";


import moment from 'moment';

import GetRestaurant from "../queries/GetRestaurant";
import SubsriptionComments from "../subscriptions/SubscriptionComments";

import AddComment from "./AddComment";

class RestaurantComments extends Component {

    subscription;

    componentDidMount() {
        this.subscription = this.props.subscribeToComments();
    }

    componentWillUnmount() {
        this.subscription();
    }

    renderComment = (comment) => {
        return (
            <div className="comment" key={comment.commentId}>
              <div className="text comment-content">
                  {comment.content}
              </div>
              <div className="metadata comment-content">{moment(comment.createdAt).format('LL, LT')}</div>
            </div>
        );
    }

    render() {
        const { comments: { items }, restaurantId } = this.props;

        return (
            <div className="ui items">
                <div className="item">
                    <div className="ui comments">
                        <h4 className="ui dividing header">Comments</h4>
                        {[].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
                        <AddComment restaurantId={restaurantId} />
                    </div>
                </div>
            </div>
        );
    }

}

const RestaurantCommentsWithData = graphql(
    GetRestaurant,
    {
        options: ({ restaurantId: id }) => ({
            fetchPolicy: 'cache-first',
            variables: { id }
        }),
        props: props => ({
            comments: props.data.getRestaurant ? props.data.getRestaurant.comments : { items: [] },
            subscribeToComments: () => props.data.subscribeToMore({
                document: SubsriptionComments,
                variables: {
                    restaurantId: props.ownProps.restaurantId,
                },
                updateQuery: (prev, { subscriptionData: { data: { subscribeToComments } } }) => {
                    const res = {
                        ...prev,
                        getRestaurant: {
                            ...prev.getRestaurant,
                            comments: {
                                __typename: 'CommentConnections',
                                ...prev.getRestaurant.comments,
                                items: [
                                    ...prev.getRestaurant.comments.items.filter(c => c.commentId !== subscribeToComments.commentId),
                                    subscribeToComments,
                                ]
                            }
                        }
                    };

                    return res;
                }
            })
        }),
    },
)(RestaurantComments);

export default RestaurantCommentsWithData;