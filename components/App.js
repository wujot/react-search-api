var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "gbDmAwIQwxuCufIHai193F3tYk6OZgQd";

App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: "",
      gif: {}
    };
  },

  getGif: function(searchingText) {
    return new Promise(function(resolve, reject) {
      var url =
        GIPHY_API_URL +
        "/v1/gifs/random?api_key=" +
        GIPHY_PUB_KEY +
        "&tag=" +
        searchingText; // 2.
      const request = new XMLHttpRequest();
      request.onload = () => {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText).data;
          var gif = {
            url: data.images.fixed_width_downsampled.url,
            sourceUrl: data.url
          };
          resolve(gif);
        } else {
          reject(new Error(request.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
        }
      };
      request.onerror = () => {
        reject(new Error(`XMLHttpRequest Error: ${request.statusText}`));
      };
      request.open("GET", url);
      request.send();
    });
  },

  handleSearch: function(searchingText) {
    // 1.
    this.setState({
      loading: true // 2.
    });
    this.getGif(searchingText).then(gif => {
      this.setState({
        //
        loading: false, // a
        gif: gif, // b
        searchingText: searchingText // c
      });
    });
  },

  render: function() {
    var styles = {
      margin: "0 auto",
      textAlign: "center",
      width: "90%"
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>
          Znajdź gifa na <a href="http://giphy.com">giphy</a>. Naciskaj enter,
          aby pobrać kolejne gify.
        </p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
