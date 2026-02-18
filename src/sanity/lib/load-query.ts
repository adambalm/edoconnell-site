import { type QueryParams } from 'sanity'
import { sanityClient } from 'sanity:client'

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'
const token = import.meta.env.SANITY_API_READ_TOKEN ?? import.meta.env.SANITY_API_WRITE_TOKEN

// Stega requires both the env flag AND a read token.
// If the token is missing, degrade to published perspective without stega.
const stegaEnabled = visualEditingEnabled && !!token

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string
  params?: QueryParams
}) {
  const perspective = stegaEnabled ? 'previewDrafts' : 'published'

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: stegaEnabled ? 'withKeyArraySelector' : false,
      stega: stegaEnabled,
      ...(stegaEnabled ? { token } : {}),
      useCdn: !stegaEnabled,
    },
  )

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  }
}
