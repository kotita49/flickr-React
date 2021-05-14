

import React, { Component } from 'react'
import './App.css'
import InfiniteScroll from 'react-infinite-scroll-component'



class App extends Component {
  constructor() {
    super()
    this.state = {
      photos: [],
    }
  }

  componentDidMount() {
    fetch(
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
        process.env.REACT_APP_API_KEY +
        '&format=json&lang?en&safe_search=1&tags=safe,pets&extras=owner_name,url_s,url_m,url_l,tags&nojsoncallback=1',
    )
      .then(function (response) {
        return response.json()
      })
      .then(
        function (data) {
          let allPhotos = data.photos.photo.map((ph) => {
            var title = ph.title
            var imgUrl =
              'https://farm' +
              ph.farm +
              '.staticflickr.com/' +
              ph.server +
              '/' +
              ph.id +
              '_' +
              ph.secret +
              '.jpg'
            var name = ph.ownername
            var tags = ph.tags
            var link =
              'https://www.flickr.com/photos/' + ph.owner + '/' + ph.id + '/'
            var owner_link = 'https://www.flickr.com/photos/' + ph.owner + '/'

            return (
              <div class="card">
                <img class="image" src={imgUrl} alt={title} />
                <div class="details">
                  <h3 class="title">
                    {' '}
                    <a href={link} target="_blank">
                      {title}{' '}
                    </a>
                  </h3>
                  <h3 class="author">
                    {' '}
                    by{' '}
                    <a href={owner_link} target="_blank">
                      {name}
                    </a>
                  </h3>
                </div>
                <div class="tags">
                  <p> Tags: #{tags}</p>
                </div>
              </div>
            )
          })
          this.setState({ photos: allPhotos })
        }.bind(this),
      )
      .catch((err) => {
        console.log(err)
      })
      
  }
  

  render() {
    return (
      <body id="home">
        <h1>Flickr </h1>
        <div>
        
                  <InfiniteScroll
            dataLength={this.state.photos.length}
               endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Now you have seen it all!</b>
              </p>
            }
          >
            <div class="container">
               
              {this.state.photos}
              </div>
          </InfiniteScroll>
        </div>
      </body>
    )
  }
}


export default App
