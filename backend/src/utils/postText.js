function extractTags(text = "") {
    const hashtags = [...text.matchAll(/#([a-zA-Z0-9_]+)/g)].map(match => match[1].toLowerCase())
    const mentions = [...text.matchAll(/@([a-zA-Z0-9._]+)/g)].map(match => match[1].toLowerCase())

    return {
        hashtags:[...new Set(hashtags)],
        mentions:[...new Set(mentions)]
    }
}

module.exports = { extractTags }
