import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleMongooseDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/dup key: \{\s*([^:]+):\s*"([^"]+)"\s*\}/)
  const fieldName = match?.[1]?.trim() || 'unknown_field'
  const fieldValue = match?.[2]?.trim() || 'unknown_value'

  const errorSources: TErrorSources = [
    {
      path: fieldName || '',
      message: fieldValue
        ? `${fieldValue} is Already exists!`
        : 'Duplicate Key Error',
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Already Exists!',
    errorSources,
  }
}

export default handleMongooseDuplicateError
