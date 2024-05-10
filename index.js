const express = require('express');
const webshot = require('./lib/webshot');

const app = express();

app.get('/', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send('url is required');
        }

        let viewport = null;
        if (req.query.viewport) {
            const viewportToken = req.query.viewport.split('x');
            viewport = {
                width: parseInt(viewportToken[0]),
                height: parseInt(viewportToken[1] || 0),
            }
        }

        const ret = await webshot({
            url,
            viewport,
        })

        return res.header('Content-Type', 'image/png').send(ret)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})