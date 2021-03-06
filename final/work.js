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
    loggedIn: false,
    page: 1,
    requestAdmin: false,
    isAdmin: false,
    isGuest: false,
    currentCard: null,
    editCardDescInput: false,
    editCardTextInput: false,
    editCardCategoryInput: false,
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
    },
    artistsPage: function() {
      this.page = 2;
    },
    writersPage: function() {
      this.page = 3;
    },
    showInput: function(l) {
      l.isInputVisible = true;
    },
    editTitle: function() {
      this.editTitleInput = null; // unfocus
      if (this.page == 3) {
        this.writeData("pages", this.pages);
      }
      else {
        this.writeData("lists", this.lists);
      }
    },
    editCardText:function() {
      this.editCardTextInput=false;
      if (this.page == 3) {
        this.writeData("pages", this.pages);
      }
      else {
        this.writeData("lists", this.lists);
      }
    },
    editCardDesc:function() {
      this.editCardDescInput=false;
      if (this.page == 3) {
        this.writeData("pages", this.pages);
      }
      else {
        this.writeData("lists", this.lists);
      }
    },
    editCardCategory: function() {
      this.editCardCategoryInput = false;
      if (this.page == 3) {
        this.writeData("pages", this.pages);
      }
      else {
        this.writeData("lists", this.lists);
      }
    },
    showCategories: function() {
      if (this.pages == 3) {
        this.categories.splice(0, this.categories.length); // clear categories
        for (i = 0; i < this.pages.length; i++) {
          for (j = 0; j < this.pages[i].cards.length; j++) {
            var category = this.pages[i].cards[j].category;
            // console.log(category);
            if (this.categories.indexOf(category) == -1) {
              this.categories.push(category);
            }
          }
        }
      }
      else {
        this.categories.splice(0, this.categories.length); // clear categories
        for (i = 0; i < this.lists.length; i++) {
          for (j = 0; j < this.lists[i].cards.length; j++) {
            var category = this.lists[i].cards[j].category;
            // console.log(category);
            if (this.categories.indexOf(category) == -1) {
              this.categories.push(category);
            }
          }
        }
    }
    },
    clickCategory: function(category) {
      this.currentCategory = category;
    },
    addComment: function(card) {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (!("comments" in card)) { // if comments array not found ...
        Vue.set(card, "comments", []); // create empty comments array
      }
      card.comments.push({
        user: this.name,
        text: this.commentText,
        owner: this.currentCard.category
      });
      this.commentText = ""; // clear input
      if (this.page == 3) {
        this.writeData("pages", this.pages);
      }
      else {
        this.writeData("lists", this.lists);
      }
    },
    deleteComment: function(card, commentIndex) { //artist can delete any comment, but comment maker can only delete their own
      if (this.name == card.comments[commentIndex].owner) { //person deleting comments on their own thing
        card.comments.splice(commentIndex, 1);
        if (this.page == 3) {
          this.writeData("pages", this.pages);
        }
        else {
          this.writeData("lists", this.lists);
        }
      }
      else if (this.name == card.comments[commentIndex].user) { //person deleting a comment they made on someone else's thing
        card.comments.splice(commentIndex, 1);
        if (this.page == 3) {
          this.writeData("pages", this.pages);
        }
        else {
          this.writeData("lists", this.lists);
        }
      }
      else if (this.name == "Admin") { //Admin removing any comment
        card.comments.splice(commentIndex, 1);
        if (this.page == 3) {
          this.writeData("pages", this.pages);
        }
        else {
          this.writeData("lists", this.lists);
        }
      }
      else {
        alert("You cannot delete this comment. Unless you are an administrator, you may only delete comments on your own work or comments you have made yourself.");
      }
    },
    editUserSubmit: function() {
      this.editUser=false;
      this.writeData("users", this.users);
    },
    newCard: function(l) {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (this.page == 2) {
        l.cards.push({
          id: Date.now(),
          text: l.inputText,
          desc: "You may include an artist's statement here if you wish.",
          timestamp: Date.now(),
          name: this.name,
          email: this.email,
          category: this.name, //used to filter by artist/writer
          todos: []
        });
        l.inputText = ""; // clear text
        this.writeData("lists", this.lists);
      }
      else {
        l.cards.push({
          id: Date.now(),
          text: l.inputText,
          desc: "You may wish to type a summary of your work here.",
          timestamp: Date.now(),
          name: this.name,
          email: this.email,
          category: this.name, //used to filter by artist/writer
          todos: []
        });
        l.inputText = ""; // clear text
        this.writeData("pages", this.pages);
      }
    },
    newList: function() {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (this.page == 2) {
        this.lists.push({
          id: Date.now(),
          title: this.addListText,
          cards: []
        });
        this.writeData("lists", this.lists);
      }
      else {
        this.pages.push({
          id: Date.now(),
          title: this.addListText,
          cards: []
        });
        this.writeData("pages", this.pages);
      }
      this.addListText = "";

    },
    moveList: function(listIndex, dir) {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (this.page == 2) {
        if (listIndex + dir >= 0 && listIndex + dir <= this.lists.length-1) { // if move is valid
          var list = this.lists[listIndex];
          if (dir == -1) { // change order
            this.lists.splice(listIndex + dir, 0, list);
            this.lists.splice(listIndex-dir, 1);
          } else {
            this.lists.splice(listIndex + dir + 1, 0, list);
            this.lists.splice(listIndex, 1);
          }
        }
        this.writeData("lists", this.lists);
      }
      else {
        if (listIndex + dir >= 0 && listIndex + dir <= this.pages.length-1) { // if move is valid
          var list = this.pages[listIndex];
          if (dir == -1) { // change order
            this.pages.splice(listIndex + dir, 0, list);
            this.pages.splice(listIndex-dir, 1);
          } else {
            this.pages.splice(listIndex + dir + 1, 0, list);
            this.pages.splice(listIndex, 1);
          }
        }
        this.writeData("pages", this.pages);
      }

    },
    moveCard: function(card, listIndex, dir) { //probably remove or replace with up down one
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (listIndex + dir >= 0 && listIndex + dir <= this.lists.length-1) { // if move is valid
        var cards = this.lists[listIndex].cards;
        cards.splice(cards.indexOf(card), 1); // remove card
        this.lists[listIndex + dir].cards.push(card); // add it to next list
        if (this.page == 3) {
          this.writeData("pages", this.pages);
        }
        else {
          this.writeData("lists", this.lists);
        }
      }
    },
    deleteCard: function(listIndex, cardIndex) {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (this.page == 2) {
        // console.log(listIndex, cardIndex);
        if (this.name == this.lists[listIndex].cards[cardIndex].name) {
          this.lists[listIndex].cards.splice(cardIndex, 1);
          this.writeData("lists", this.lists);
        }
        else if (this.name == "Admin") {
          this.lists[listIndex].cards.splice(cardIndex, 1);
          this.writeData("lists", this.lists);
        }
        else {
          alert("You cannot delete work that isn't yours!");
        }
      }
      else {
        if (this.name == this.pages[listIndex].cards[cardIndex].name) {
          this.pages[listIndex].cards.splice(cardIndex, 1);
          this.writeData("pages", this.pages);
        }
        else if (this.name == "Admin") {
          this.pages[listIndex].cards.splice(cardIndex, 1);
          this.writeData("pages", this.pages);
        }
        else {
          alert("You cannot delete work that isn't yours!");
        }
      }
    },

    // numCards: function() { //bool to determine whether to show "add a card" option
    //   for (i = 0; i < this.lists.length; i++) {
    //     if (this.lists[i].cards.length > 1) {
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
        this.requestAdmin = false;
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
    collapseExpandList: function(listIndex) { //alright, I'll let the guests do this haha
      if (this.page == 2) {
        if ("collapsed" in this.lists[listIndex]) {
          this.lists[listIndex].collapsed = !this.lists[listIndex].collapsed; // invert
        } else {
          Vue.set(this.lists[listIndex], "collapsed", true);
        }
        this.writeData("lists", this.lists);
      }
      else {
        if ("collapsed" in this.pages[listIndex]) {
          this.pages[listIndex].collapsed = !this.pages[listIndex].collapsed; // invert
        } else {
          Vue.set(this.pages[listIndex], "collapsed", true);
        }
        this.writeData("pages", this.pages);
      }
    },
    // hasOne: function(list) {
    //   for (i = 0; i < list.length; i++) {
    //     if (list[i].cards.length > 0) {
    //       return false;
    //     }
    //   }
    //   return true;
    // },
    deleteList: function(listIndex) { //only administrators may remove complete mediums
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
      if (this.page == 2) {
        if (this.name == "Admin") {
          this.lists.splice(listIndex, 1);
          this.writeData("lists", this.lists);
        }
        else if (this.lists[listIndex].cards.length == 0) {
          this.lists.splice(listIndex, 1);
          this.writeData("lists", this.lists);
        }
        else {
          // console.log(this.lists[listIndex].cards.length);
          alert("Only administrators may remove non-empty categories. If all the works in a category are owned by you, you can remove that category by first removing the individual works.")
        }
      }
      else { //if we're on the writing page
        if (this.name == "Admin") {
          this.pages.splice(listIndex, 1);
          this.writeData("pages", this.pages);
        }
        else if (this.pages[listIndex].cards.length == 0) {
          this.pages.splice(listIndex, 1);
          this.writeData("pages", this.pages);
        }
        else {
          // console.log(this.lists[listIndex].cards.length);
          alert("Only administrators may remove non-empty categories. If all the works in a category are owned by you, you can remove that category by first removing the individual works.")
        }
      }
    },
    showCardModal: function(card) {
      this.currentCard = card;
    },
    // makepdf: function() {
    //   console.log(this.currentCard.link);
    //   // https://drive.google.com/viewerng/viewer?embedded=true&url=
    // },
    uploadImage(e) {
      if (this.isGuest) {
        alert("You cannot do this while in guest mode. Please log in to store any preferences.")
        return;
      }
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
          vm.currentCard.link = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + url;
          // console.log(url);
          // update db
          if (vm.page == 2) {
            vm.writeData("lists", vm.lists);
            alert("Image uploaded!");
          }
          else {
            vm.writeData("pages", vm.pages);
            alert("Your piece has been uploaded!");
            // console.log(url);
          }
        });

      });
    }
  },

  created: function(){
    var vm = this;
    // read from firebase
    function readData(snapshot) {
      var data = snapshot.val();

      if ("lists" in data) { // check if lists exist in database
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


      if ("pages" in data) { // check if lists exist in database
        for (i = 0; i < data.pages.length; i++) {
          vm.pages.push(data.pages[i]);
          // console.log(data.lists[i]);

          if (!("cards" in data.pages[i])) { // check if list has cards
            data.pages[i].cards = []; // add empty cards array if no cards
          }
        }
      }

      // prevent further reads
      firebase.database().ref("/").off("value", readData);
    }
    // get data
    firebase.database().ref("/").on("value", readData);
  }
});
