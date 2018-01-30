angular.module('starter.translate', ['pascalprecht.translate'])
.config(function($translateProvider){
	//Config language
	$translateProvider.preferredLanguage("en");
	$translateProvider.fallbackLanguage("en");
	// Enable escaping of HTML
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	//Translate for EN
	$translateProvider.translations('en', {
                                    title: "Tucson2Night",
                                    Home: "Home",
                                    fontSize: "Font Size",
                                    Bookmark: "Favorite",
                                    unBookmark: "Remove Fav",
                                    Small: "Small",
                                    Normal: "Normal",
                                    Large: "Large",
                                    extraLarge: "Extra Large",
                                    Settings: "Settings",
                                    textSize: "Text size",
                                    textSizeDescription: "Text size for story pages",
                                    notification: "Notifications",
                                    disconnected: "Network disconnected",
                                    photos: "Photos Archive",
                                    videos: "Videos",
                                    latest: "LATEST",
                                    topnew: "TOP NEW",
                                    video: "VIDEO",
                                    trending: "TRENDING",
                                    thisArticle: "This post has",
                                    comment: "comment",
                                    comments: "comments",
                                    addComment: "COMMENT",
                                    nextStory: "MORE GALLERIES",
                                    Comment: "Comment",
                                    noData: "NO DATA",
                                    logout: "Logout",
                                    myBookmarks: "My Favorites",
                                    appSettings: "App Settings",
                                    support: "Support",
                                    rateApp: "Rate this App",
                                    shareApp: "Share this app",
                                    information: "Information",
                                    aboutUs: "About us",
                                    termsOfUse: "User Guide",
                                    privacyPolicy: "Location",
                                    version: "Version",
                                    versionNumber: "1.0.0",
                                    news: "News",
                                    photo: "Photo",
                                    bookmark: "Favorites",
                                    noBookmark: "No Favorites found",
                                    logIn: "Log in",
                                    username: "Username",
                                    password: "Password",
                                    forgotPassword: "Forgot password?",
                                    notMember: "Not a member yet?",
                                    signUpNow: "SIGN UP NOW",
                                    resetPassword: "Reset Password",
                                    enterEmail: "Enter your register email address",
                                    email: "Email",
                                    register: "Register",
                                    weNeed: "We need a few more details about you before we set up your account",
                                    firstName: "First Name",
                                    lastName: "Last Name",
                                    rePassword: "Re-Password",
                                    iAgree: "I agree to the",
                                    termsConditions: "TDN Terms & Conditions",
                                    keyword: "Keyword",
                                    emptyList: "Empty list",
                                    noResult: "No results avalible",
                                    
	});
	//End Translate for EN
});
