const fs = require('fs')
const path = require('path')

// Function to add favicon to docs-gen
async function addFaviconToDocsGen() {
    const docsGenDir = path.join(__dirname, 'docs-gen')
    const faviconPath = path.join(__dirname, 'favicon.ico')
    const docsGenFaviconPath = path.join(docsGenDir, 'favicon.ico')
    const indexHtmlPath = path.join(docsGenDir, 'index.html')

    // Check if docs-gen exists
    fs.access(docsGenDir, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('docs-gen folder does not exist.')
            return
        }

        // Copy favicon to docs-gen
        fs.copyFile(faviconPath, docsGenFaviconPath, (err) => {
            if (err) {
                console.log('Error copying favicon:', err)
                return
            }
            console.log('Favicon copied to docs-gen.')

            // Modify index.html in docs-gen to add favicon
            fs.access(indexHtmlPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log('index.html not found in docs-gen.')
                    return
                }

                fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
                    if (err) {
                        console.log('Error reading index.html:', err)
                        return
                    }

                    // Add favicon to the <head> section
                    const updatedData = data.replace('</head>', '<link rel="icon" type="image/x-icon" href="favicon.ico"></head>')

                    fs.writeFile(indexHtmlPath, updatedData, 'utf8', (err) => {
                        if (err) {
                            console.log('Error writing index.html:', err)
                            return
                        }
                        console.log('Favicon added to index.html in docs-gen.')
                    })
                })
            })
        })
    })
}

// Call the function
addFaviconToDocsGen()
