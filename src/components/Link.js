import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (<div>
              {this.props.index + 1}.
              {authToken && <div
                        className="pointer button"
                        onClick={() => this._voteForLink()}
                      >Up</div>}
                {this.props.link.description} ({this.props.link.url})

                {this.props.link.votes.length} votes | by{' '}
                {this.props.link.postedBy
                  ? this.props.link.postedBy.name
                  : 'Unknown'}{' '}
                {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
    )
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, linkId)
      },
    })
  }
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default graphql(VOTE_MUTATION, {
  name: 'voteMutation',
})(Link)