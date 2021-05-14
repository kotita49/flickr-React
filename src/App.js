

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
  fetchSearchData = (pageNumber, searchQuery) => {
    this.setState(
      {
        loading: true,
      });
    let url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + process.env.REACT_APP_API_KEY + '&format=json&page=' + pageNumber + '&lang?en&safe_search=1&text='+searchQuery+'&extras=owner_name,url_s,url_m,url_l,date_taken,description,tags&nojsoncallback=1';
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let pictures = []
        data.photos.photo.map((pic) => {

          var title = pic.title;
          var media = 'https://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '.jpg';
          var date = new Date(pic.datetaken).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          var time = new Date(pic.datetaken).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });
          var author = pic.ownername;
          if (pic.tags === '') {
            var tags = ''
          }
          else {
            var tags_end = (pic.tags.split(' ')).join(', #');
            var tags_start = 'Tags: #';
            var tags = tags_start + tags_end;
          }
          var link = 'https://www.flickr.com/photos/' + pic.owner + '/' + pic.id + '/';
          var author_link = 'https://www.flickr.com/photos/' + pic.owner + '/';

          var pic = {
            title: title,
            media: media,
            date: date,
            time: time,
            author: author,
            tags: tags,
            link: link,
            author_link: author_link
          }
          pictures.push(pic);
        })
        this.setState({
          pictures: [...this.state.pictures, ...pictures]
        });
        this.setState({
          loading: false
        })
      }.bind(this))
      .catch((err) => {
        console.log(err)
      });
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
       this.setState({pictures: [], page:1});
    this.fetchSearchData(this.state.page, this.state.search);
    this.setState({ loading: true });
  }
  myChangeHandler = (event) => {
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <body id="home">
        <h1>Flickr </h1>
        <div>
        <div class='search-bar'>
            <form class="form-inline my-2 my-lg-0" onSubmit={this.mySubmitHandler}>
              <input class="form-control mr-sm-2" type="search" placeholder="Search photos" aria-label="Search" onChange={this.myChangeHandler} />
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" >Search</button>
            </form>
          </div>
                  <InfiniteScroll
            dataLength={this.state.photos.length}
            loader={<i class="fas fa-spinner fa-pulse"></i>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Now you have seen it all!</b>
              </p>
            }
          >
            <div class="container">
               
              {this.state.photos}</div>
          </InfiniteScroll>
        </div>
      </body>
    )
  }
}



export default App
