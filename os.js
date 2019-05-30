class OS {
    currentView = 'homeview';
    apps = [
        Facebook,
        Twitter,
        Google
    ];

    constructor(id) {
        this.initButtonListeners();
        this.render();
    }

    getApps() {
        return this.apps;
    }

    initButtonListeners() {

    }

    render() {

    }
}

class HomeView {
    constructor() {
        
    }

    render() {

    }
}

class MenuView {
    constructor(os) {
        this.os = os;
    }

    render() {
        this.os.getApps();
    }
}

class App {
    getIcon() {
        return `<img src="${this.icon}" />`;
    }
}

class Facebook extends App {
    constructor() {
        this.icon = '';
    }
}

class Twitter extends App {
    constructor() {
        this.icon = '';
    }
}

class Google extends App {
    constructor() {
        this.icon = '';
    }
}
