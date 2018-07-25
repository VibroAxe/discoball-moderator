# discoball-moderator
A discoball repo to provide basic moderator actions

# Commands
## !topic
### Usage
`!topic the new topic` Sets the topic in the current channel to be "the new topic"

## !delete
### Usage

`!delete x` deletes the last x chat messages in the channel

`!delete @user x` deletes the last x chat messages from @user in the channel

### Limitations
Can only operate on the last 100 messages, so `!delete @user x` will delete up to x messages from @user within the last 100 messages
