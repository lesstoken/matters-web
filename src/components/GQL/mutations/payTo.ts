import gql from 'graphql-tag'

export default gql`
  mutation PayTo(
    $amount: amount_Float_NotNull_exclusiveMin_0!
    $currency: TransactionCurrency!
    $purpose: TransactionPurpose!
    $recipientId: ID!
    $targetId: ID
    $password: String
  ) {
    payTo(
      input: {
        amount: $amount
        currency: $currency
        purpose: $purpose
        recipientId: $recipientId
        targetId: $targetId
        password: $password
      }
    ) {
      transaction {
        id
        state
      }
      redirectUrl
    }
  }
`
