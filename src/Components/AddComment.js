import React, { Component } from "react";
import { graphql } from "react-apollo";
import { v4 as uuid } from "uuid";

import CreateComment from "../mutations/CreateComment";
import GetRestaurant from "../queries/GetRestaurant";
import moment from "moment";

class AddComment extends Component {

    static defaultProps = {
        createComment: () => null,
    }

    static defaultState = {
        comment: {
            content: '',
        },
        loading: false,
    };

    state = AddComment.defaultState;

    handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { comment } = this.state;
        const { restaurantId, createComment } = this.props;

        this.setState({ loading: true });

        await createComment({
            ...comment,
            restaurantId,
            createdAt: moment.utc().format(),
        });

        this.setState(AddComment.defaultState);
    }

    handleChange = ({ target: { value: content } }) => {
        this.setState({ comment: { content } });
    }

    render() {
        const { comment, loading } = this.state;
        return (
            <form className="ui reply form">
                <div className="field">
                    <textarea value={comment.content} onChange={this.handleChange} disabled={loading}></textarea>
                </div>
                <button className={`ui green submit icon button ${loading ? 'loading' : ''}`}
                    disabled={loading} onClick={this.handleSubmit}>
                    Add Comment
                </button>
            </form>
        );
    }
}

const NewCommentWithData = graphql(
    CreateComment,
    {
        options: props => ({
            update: (proxy, { data: { commentOnRestaurant } }) => {
                const query = GetRestaurant;
                const variables = { id: commentOnRestaurant.restaurantId };
                const data = proxy.readQuery({ query, variables });

                data.getRestaurant = {
                    ...data.getRestaurant,
                    comments: {
                        ...data.getRestaurant.comments,
                        items: [
                            ...data.getRestaurant.comments.items.filter(c => c.commentId !== commentOnRestaurant.commentId),
                            commentOnRestaurant,
                        ]
                    }
                };

                proxy.writeQuery({ query, data });
            },
        }),
        props: props => ({
            createComment: (comment) => {
                return props.mutate({
                    variables: { ...comment },
                    optimisticResponse: { commentOnRestaurant: { ...comment, __typename: 'Comment', commentId: uuid() } },
                });
            }
        })
    }
)(AddComment);

export default NewCommentWithData;