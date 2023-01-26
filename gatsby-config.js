const basePath = '/libro-de-motes-milan'

module.exports = {
    pathPrefix: basePath,
    siteMetadata: {
        title: `Libro de Motes de Damas y Caualleros Luys Milan`,
        description: `Edición mínima del Libro de Motes de Luys Milan`,
        author: `Julieta Goldsmidt`
    },
    plugins: [
        `gatsby-plugin-material-ui`,
        `gatsby-theme-ceteicean`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `src/content/tei`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `src/content/pages`,
                name: `html`,
            },
        },
    ],
}