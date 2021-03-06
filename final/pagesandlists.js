// custom directive to autofocus when input is shown (https://vuejs.org/v2/guide/custom-directive.html)
Vue.directive('focus', {
  componentUpdated: function (el) {
    el.focus();
  }
});

var i;
var j;
// var page = 1;

var config = {
  apiKey: "AIzaSyC0K41GpMkumS2nGnAZcd0Z_eFy6ldNR48",
  authDomain: "finalproject290.firebaseapp.com",
  databaseURL: "https://finalproject290.firebaseio.com",
  projectId: "finalproject290",
  storageBucket: "finalproject290.appspot.com",
  messagingSenderId: "211178796439"
  };
  firebase.initializeApp(config);

var app = new Vue({
  el: "#app",
  data: {
    lists: [],
    users: [],
    pages: [],
    both: [],
    visibleInput: null, // key of list that has visible input for adding cards
    editTitleInput: null, // ... editing title
    addListText: "",
    name: "",
    email: "",
    pwort: "",
    currentCategory: "",
    // size: "",
    // year: "",
    link: "",
    kind: "", //pages or lists
    loggedIn: false,
    page: 1,
    requestAdmin: false,
    isAdmin: false,
    isGuest: false,
    currentCard: null,
    editCardDescInput: false,
    editCardTextInput: false,
    editCardCategoryInput: false,
    colors: [
      "#337435",
      "#e26a44",
      "#333",
      "#f1e312",
    ],
    currentColor: "#337435",
    editUser: false,
    horizView: false,
    categoriesVisible: false,
    categories: [],
    todoText: "",
    commentText: "",
  },
  methods: {
    homepage: function() {
      this.page = 1;
      // this.kind = "lists";
      // this.both = this.lists; //for admin pwort purposes
    },
    artistsPage: function() {
      this.page = 2;
      this.kind = "lists";
      this.both = this.lists;
    },
    writersPage: function() {
      this.page = 3;
      this.kind = "pages";
      this.both = this.pages;
    },
    showInput: function(l) {
      l.isInputVisible = true;
    },
    editTitle: function() {
      this.editTitleInput = null;
      this.writeData(this.kind, this.both);
    },
    editCardText:function() {
      this.editCardTextInput=false;
      this.writeData(this.kind, this.both);
    },
    editCardDesc:function() {
      this.editCardDescInput=false;
      this.writeData(this.kind, this.both);
    },
    editCardCategory: function() {
      this.editCardCategoryInput = false;
      this.writeData(this.kind, this.both);
    },
    showCategories: function() {
      this.categories.splice(0, this.categories.length); // clear categories
      for (i = 0; i < this.both.length; i++) {
        for (j = 0; j < this.both[i].cards.length; j++) {
          var category = this.both[i].cards[j].category;
          // console.log(category);
          if (this.categories.indexOf(category) == -1) {
            this.categories.push(category);
          }
        }
      }
    },
    clickCategory: function(category) {
      this.currentCategory = category;
    },
    addTodo: function(card) {
      if (!("todos" in card)) { // if todos array not found ...
        Vue.set(card, "todos", []); // create empty todos array
      }
      card.todos.push(this.todoText);
      this.todoText = ""; // clear input
      this.writeData(this.kind, this.both);
    },
    deleteTodo: function(card, todoIndex) {
      card.todos.splice(todoIndex, 1);
      this.writeData(this.kind, this.both);
    },
    addComment: function(card) {
      if (!("comments" in card)) { // if comments array not found ...
        Vue.set(card, "comments", []); // create empty comments array
      }
      card.comments.push({
        user: this.name,
        text: this.commentText,
        owner: this.currentCard.category
      });
      this.commentText = ""; // clear input
      this.writeData(this.kind, this.both);
    },
    deleteComment: function(card, commentIndex) { //artist can delete any comment, but comment maker can only delete their own
      if (this.name == card.comments[commentIndex].owner) {
        card.comments.splice(commentIndex, 1);
        this.writeData(this.kind, this.both);
      }
      else if (this.name == card.comments[commentIndex].user) {
        card.comments.splice(commentIndex, 1);
        this.writeData(this.kind, this.both);
      }
      else {
        alert("You cannot delete this comment! You may only delete comments on your own work or comments you have made yourself.");
      }
    },
    editUserSubmit: function() {
      this.editUser=false;
      this.writeData("users", this.users);
    },
    newCard: function(l) {
      l.cards.push({
        id: Date.now(),
        text: l.inputText,
        desc: "Include your artist's statement here",
        timestamp: Date.now(),
        name: this.name,
        email: this.email,
        category: this.name, //used to filter by artist/writer
        todos: []
      });
      l.inputText = ""; // clear text
      this.writeData(this.kind, this.both);
    },
    newList: function() {
      this.both.push({
        id: Date.now(),
        title: this.addListText,
        cards: []
      });
      this.writeData(this.kind, this.both);
      this.addListText = "";

    },
    moveList: function(listIndex, dir) {
      if (listIndex + dir >= 0 && listIndex + dir <= this.both.length-1) { // if move is valid
        var list = this.both[listIndex];
        if (dir == -1) { // change order
          this.both.splice(listIndex + dir, 0, list);
          this.both.splice(listIndex-dir, 1);
        } else {
          this.both.splice(listIndex + dir + 1, 0, list);
          this.both.splice(listIndex, 1);
        }
        this.writeData(this.kind, this.both);
      }
    },
    moveCard: function(card, listIndex, dir) {
      if (listIndex + dir >= 0 && listIndex + dir <= this.both.length-1) { // if move is valid
        var cards = this.both[listIndex].cards;
        cards.splice(cards.indexOf(card), 1); // remove card
        this.both[listIndex + dir].cards.push(card); // add it to next list
        this.writeData(this.kind, this.both);
      }
    },
    deleteCard: function(listIndex, cardIndex) {
      if (this.name == this.both[listIndex].cards[cardIndex].name) {
        this.both[listIndex].cards.splice(cardIndex, 1);
        this.writeData(this.kind, this.both);
      }
      else {
        alert("You cannot delete work that isn't yours!");
      }

    },

    // numCards: function() { //bool to determine whether to show "add a card" option
    //   for (i = 0; i < this.both.length; i++) {
    //     if (this.both[i].cards.length > 1) {
    //       return;
    //     }
    //     addACard = true;
    //     return;
    //   }
    // },

    login: function() {
      // var flag = false;
      for (i = 0; i < this.users.length; i++) {
        if (this.users[i].name == this.name && this.users[i].email == this.email) { // check if user exists
          this.loggedIn = true;
          return;
        }
      }
      for (i = 0; i < this.users.length; i++) {
        if (this.users[i].name == this.name && this.users[i].email != this.email) { // user exists but password different
          // this.loggedIn = true;
          alert("Password does not match the username.")
          return;
        }
      }
      alert("Please register an account first!");
    },
    register: function() {
      for (i = 0; i < this.users.length; i++) {
        if (this.users[i].name == this.name) { // check if user exists
          alert("An account by this name already exists. Please login with the Returning User button or choose a different username.");
          return;
        }
      }
      this.users.push({
        id: this.users.length,
        name: this.name,
        email: this.email
      });
      this.loggedIn = true;
      this.writeData("users", this.users);
    },
    guest: function() {
      // this.users.push({
      //   id: this.users.length,
      //   name: "guest",
      //   email: this.email
      // });
      this.name = "Guest";
      this.loggedIn = true;
      this.isGuest = true;
      // this.writeData("users", this.users);
    },
    admin: function() {
      this.requestAdmin = true;
    },
    submit: function() {
      if (this.pwort == this.lists[0].cards[0].name) { //admin password is stored in firebase. be careful when editing database!
        this.requestAdmin = false; //reverted to lists bc "both" undefined before login
        this.name = "Admin";
        this.loggedIn = true;
        this.isAdmin = true;
      }
      else {
        alert("Password is incorrect.")
      }
    },
    notAdmin: function() {
      this.requestAdmin = false;
    },
    forgot: function() {
      alert("Please email VLW9@duke.edu with your username to get a new password.")
    },
    // getTimestamp: function(card) {
    //   if (card != null) {
    //     var date = new Date(card.timestamp);
    //     return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    //   }
    // },
    // getDeadline: function(card) {
    //   if (card != null) {
    //     var date = new Date(card.timestamp + 604800000);
    //     return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    //   }
    // },
    writeData: function(key, data) {
      firebase.database().ref("/" + key).set(data);
    },
    collapseExpandList: function(listIndex) {
      if ("collapsed" in this.both[listIndex]) {
        this.both[listIndex].collapsed = !this.both[listIndex].collapsed; // invert
      } else {
        Vue.set(this.both[listIndex], "collapsed", true);
      }
      this.writeData(this.kind, this.both);
    },
    deleteList: function(listIndex) { //only administrators may remove complete mediums
      if (this.name == "Admin") {
        this.both.splice(listIndex, 1);
        this.writeData(this.kind, this.both);
      }
    },
    showCardModal: function(card) {
      this.currentCard = card;
    },
    uploadImage(e) {
      // get file(s)
      var files = e.target.files || e.dataTransfer.files;
      // generate image ID
      var imageName = Date.now() + "-" + files[0].name;
      var vm = this;

      // upload image
      firebase.storage().ref(imageName).put(files[0]).then(function(snapshot) {
        // add images array if does not exist
        if (!("images" in vm.currentCard)) {
          Vue.set(vm.currentCard, "images", []);
        }
        // get URL
        firebase.storage().ref(imageName).getDownloadURL().then(function(url) {
          vm.currentCard.images.push(url);
          vm.currentCard.link = url;
          // console.log(url);
          // update db
          vm.writeData(this.kind, vm.both);
          alert("Image uploaded!");
        });

      });
    }
  },

  created: function(){
    var vm = this;
    // read from firebase
    function readData(snapshot) {
      var data = snapshot.val();

      if (this.kind in data) { // check if lists exist in database
        for (i = 0; i < data.lists.length; i++) {
          vm.lists.push(data.lists[i]);
          // console.log(data.lists[i]);

          if (!("cards" in data.lists[i])) { // check if list has cards
            data.lists[i].cards = []; // add empty cards array if no cards
          }
        }
      }
      for (i = 0; i < data.users.length; i++) {
        vm.users.push(data.users[i]);
      }

      // prevent further reads
      firebase.database().ref("/").off("value", readData);
    }
    // get data
    firebase.database().ref("/").on("value", readData);
  }
});

// console.log(app.data);


// .files[0].name;
