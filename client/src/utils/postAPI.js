import axios from "axios";

// The getByQuery method retrieves results from the server
// It can accept a "query" that may be a search term or id
export default {
  getAll: function() {
    return axios.get("/posts/all");
  },

  getActiveUserPosts: function() {
    return axios.get("/posts");
  },

  createPost: function(post) {
    return axios.post("/posts", post);
  },

  updatePost: function(id, post) {
    return axios.put(`/posts/update/${id}`, post);
  },

  searchByTitle: function(title) {
    return axios.get(`/posts/search/${title}`);
  },

  getById: function(id) {
    return axios.get(`/posts/${id}`);
  },

  publishNote: function(id) {
    return axios.get(`/posts/publish/${id}`);
  },

  unpublishNote: function(id) {
    return axios.get(`/posts/unpublish/${id}`);
  },

  deleteNote: function(id) {
    return axios.delete(`/posts/${id}`);
  },

  getLastPosts: function(amount) {
    return axios.get(`/posts/get/${amount}`);
  }
};