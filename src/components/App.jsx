// import { getImages } from "API/getImages";
// import { Component, useEffect } from "react";
// import { ImageList } from "./ImageGallery/ImageGallery";
// import { InputField } from "./Searchbar/Searchbar";
 
// export class App extends Component {
//   state = {
//     images: [],
//     search: '',
//     page: 1,

//   };

//   onChange = (e) => {
//     this.setState(
//       { search: e.target.value }
//     )
//   };

//   onSubmit = (e) => {
//     e.preventDefault();
//     getImages(this.state.search, this.state.page).then((data) => {
//       console.log(data);
//     })
//   }
//   // useEffect(() => { getImages("cat", 24).then(res => this.setState({ images: res.data.hits })) }, []);
//   // getImages = ("cat", 24) => {
     
//   // }
//   render() {
//     return (
//       <>
//         <InputField />
//         <ImageList />
//         <form onSubmit={this.onSubmit}>
//           <input type="text"
//            onChange={this.onChange}
//           />
//           <button type="submit">Submit</button>
//         </form>
//       </>
//     );
// }

// };

// // 1. як коректно викликати сюди запит та отримати його результати ?
// // 2. як правильно побудувати структуру рендера у відношенні ImageList та ImageItem ?
// // 3. як потім протанути до них необхідні параметри якщо вони нам приходять з сервера ?

import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import css from '../components/App.module.css';
import getImages from '../API/getImages';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Button } from './Button';
import { Loader } from './Loader';

export class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    status: 'idle',
    cuurentPage: 1,
  };

  componentDidMount() {
    getImages(this.state.searchQuery, this.state.cuurentPage)
      .then(response =>
        this.setState({ images: response.data.hits, status: 'resolved' })
      )
      .catch(error =>
        this.setState({ error: error.message, status: 'rejected' })
      );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.cuurentPage !== this.state.cuurentPage
    ) {
      getImages(this.state.searchQuery, this.state.cuurentPage)
        .then(response =>
          this.setState(prevState => ({
            images: [...prevState.images, ...response.data.hits],
            status: 'resolved',
          }))
        )
        .catch(error =>
          this.setState({ error: error.message, status: 'rejected' })
        );
    }
  }

  handleSubmit = searchQuery => {
    this.setState({ searchQuery, images: [], cuurentPage: 1 });
  };

  loadMore = () => {
    this.setState(prevState => ({ cuurentPage: prevState.cuurentPage + 1 }));
  };

  render() {
    const { status, images } = this.state;

    if (status === 'idle') {
      return (
        <div className={css.app}>
          <Searchbar onSubmit={this.handleSubmit} />
          <ToastContainer autoClose={3000} />
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className={css.app}>
          <Searchbar onSubmit={this.handleSubmit} />
          <ToastContainer autoClose={3000} />
          <Loader />
        </div>
      );
    }

    if (status === 'rejected' || images.length === 0) {
      return (
        <div className={css.app}>
          <Searchbar onSubmit={this.handleSubmit} />
          <ToastContainer autoClose={3000} />
          <p>Unfortunately there is no such image</p>
        </div>
      );
    }
    if (status === 'resolved') {
      return (
        <div className={css.app}>
          <Searchbar onSubmit={this.handleSubmit} />
          <ToastContainer autoClose={3000} />
          <ImageGallery images={this.state.images} />
          {this.state.images.length !== 0 && (
            <Button onHandleClick={this.loadMore} />
          )}
        </div>
      );
    }
  }
}