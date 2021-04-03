class repos {
	constructor(title = "no tittle", des = "no description", status = null, link = null) {
		this.title = title;
		this.link = link;
		this.description = des;
		this.status = status;
	}
}

Vue.component('sign-up', {
	props: ["name"],
	data: function () {
		return {
			loginTest: "",
			img: "https://avatars.githubusercontent.com/u/9919?v=4",
			followers: "",
			following: ""
		}
	},
	methods: {
		userLogin: function (user) {
			this.login = user
			localStorage.setItem('login', user)
		},
		login: function (loginTest) {
			localStorage.setItem("login", this.loginTest);
			app.loged(this.loginTest);
			app.loaded = true;
		}
	},
	watch: {
		loginTest: function (param) {
			$.get(`https://api.github.com/users/${this.loginTest}`, (data) => {
				this.img = data.avatar_url
				this.following = data.following
				this.followers = data.followers
			});

		}
	},

	template: ` 
	<div class="">
	   <img :src="img" class="h-10 w-10 m-auto object-cover rounded-full box-content border-2 border-gray-400" id="accountImgfound">
	   <h4 class="font-serif m-auto text-center">{{loginTest}}</h4> 
	   <div class="text-white">    
	  <label>followers:{{followers}}</label> <br/> 
	   <label>following:{{following}}</label> <br/> 
	   </div>
	   <label for="sign-up">Enter Github username:</label> <br/> 
       <input type="text" v-model="loginTest" id="sign-up"></input><br/>         
	   <button @click="login" class="flex-shrink-0 bg-purple-600 text-white text-base font-semibold my-4 py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200">
	   login 
	 </button>   
	</div> 
	`
})

const app = new Vue({
	el: "#app",
	data: {
		config: {},
		login: localStorage.getItem('login') || null,
		loaded: false,
		readme: false,
		showUserMenu: false,
		cardView: true,
		showSideBar: false,
		showSearch: false,
		readmefile: "",
		user: {},
		repos: {},
		cardContent: []

	},
	methods: {
		getData: function () {
			$.get("config.json", (data) => {
				this.config = data;
			});
			if (this.login != null) {
				$.get(`https://api.github.com/users/${this.login}`, (data) => {
					this.user = data
				});
			}
		},
		getRepo: function () {
			$.get(`https://api.github.com/users/${this.login}/repos`, (data) => {
				this.repos = data;
			});
		},
		showReadme: function (index) {
			$.get(`https://raw.githubusercontent.com/${this.login}/${this.repos[index].name}/${this.repos[index].default_branch}/README.md`, (data) => {
				this.readme = true;
				this.readmefile = data;
			});
		},
		unavailable: function () {
			alert('you cannot use this feature');
		},
		loged: function (data) {
			this.login = data;
			this.getRepo()
			this.getData()
		},
		logout: function () {
			localStorage.removeItem('login')
			this.login = false;
			this.showUserMenu = false;
			this.loaded = false;
		}
	},
	watch: {
		repos: function () {
			this.repos.forEach(rep => {
				this.cardContent.push(new repos(rep.name, rep.description))
			});
			setTimeout(() => {
				this.loaded = true;
			}, this.config.loadTime);
		},
	},
	mounted: function () {
		this.$nextTick(function () {
			app.getData();
			if (this.login) this.getRepo()
		})
	}
});
feather.replace();
