# Node-Webshot

Node-Webshot is a simple wrapper around webshot, a node web service that takes a screenshot of a web page.

## Installation

```shell
git clone [this repo]
cd [path to repo]
npm install
```

## Usage

```shell
npm run start
```

This will start the server on port 3000.<br>
To take a screenshot, send a GET request to `/` with the following parameters:

* `url`: The URL of the page to take a screenshot of.
* `viewport`: The viewport of the page to take a screenshot of (optional). The viewport format is `[width]x[height]`;
  For example, `1920x1080` for a 1920x1080 viewport.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or pull request if you have any suggestions or improvements.