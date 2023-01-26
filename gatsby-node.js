const { createContentDigest } = require("gatsby-core-utils")
const {pathPrefix} = require("./gatsby-config")

isProduction = process.env.NODE_ENV == "production"

exports.onCreateNode = async ({
  node, loadNodeContent, createNodeId, actions
}) => {

  // only care about html files
  if (node.internal.type !== 'File' || node.internal.mediaType !== 'text/html') return
  
  const { createNode } = actions;

  const nodeContent = await loadNodeContent(node)

  const htmlNodeContent = {
    id: createNodeId(node.relativePath),
    content: nodeContent,
    name: node.name,
    internal: {
      type: 'HTMLContent',
      contentDigest: createContentDigest(nodeContent),
    },
  }

  createNode(htmlNodeContent)
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const pageComponent = require.resolve(`./src/components/page.jsx`)
  const edComponent = require.resolve(`./src/components/edition.jsx`)

  const result = await graphql(`
    query {
      allFile(filter: {extension: {eq: "html"}}) {
        nodes {
          internal {
            content
          }
          name
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create pages
  result.data.allFile.nodes.map(node => {
    
    const path = node.name === 'home' ? '/' : node.name 
    const component = node.name === 'edition' ? edComponent : pageComponent

    // Fix paths with regex (this is pretty unsafe, but will do for this pedagogical example)
    const rawPage = node.internal.content
    let rawContent = rawPage

    if (rawContent) {
      // src attributes
      rawContent = rawContent.replace(/src="(?!https?:\/\/)([^"]+)"/g, `src="${isProduction ? pathPrefix : ''}/$1"`)
      // href attributes
      rawContent = rawContent.replace(/href="(?:\/)(?!https?:\/\/)([^"]+)"/g, `href="${isProduction ? pathPrefix : ''}/$1"`)
      // links to root in production
      if (isProduction) {
        rawContent = rawContent.replace(/href="\/"/g, `href="${pathPrefix}/"`)
      }
    } else {
      rawContent = "The HTML data failed to load on build. Try to clear the cache (e.g. with `npm run clean`) and try again."
    }

    createPage({
      path,
      component,
      context: {
        name: node.name,
        rawContent,
      }
    })
  })

  const teiComponent = require.resolve(`./src/gatsby-theme-ceteicean/components/Ceteicean.jsx`)

  const teiResult = await graphql(`
    query {
      allCetei {
        nodes {
          prefixed
          elements
          parent {
            ... on File {
              name
              publicURL
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  for (const node of teiResult.data.allCetei.nodes) {
    const name = node.parent.name
    createPage({
      path: name,
      component: teiComponent,
      context: {
        name,
        publicURL: node.parent.publicURL,
        prefixed: node.prefixed,
        elements: node.elements
      }
    })
  }
}
