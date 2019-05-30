String.prototype.toDOM=function(){
    var d=document,i
        ,a=d.createElement("div")
        ,b=d.createDocumentFragment()
    a.innerHTML = this
    while(i=a.firstChild)b.appendChild(i)
    return b
}

class OS {
    apps = [
        new Nairaland(),
        new Twitter(),
        new Google()
    ];

    constructor(id) {
        this.phone = document.getElementById(id);
        this.phoneScreen = this.phone.querySelector('.screen');
        this.menuButton = this.phone.querySelector('.menu-btn');
        this.toggleHomeMenuButton = this.phone.querySelector('.toggle-home-menu-btn');
        this.homeKey = this.phone.querySelector('.home-btn');

        this.views = {
            'home_view': new HomeView(this),
            'boot_view': new BootView(this),
            'menu_view': new MenuView(this),
        };
        
        this.initButtonListeners();

        this.startBoot();
    }

    switchToView(viewname) {
        this.currentView = viewname;
        this.outputToScreen();
    }

    startBoot() {
        this.currentView = 'boot_view';
        this.outputToScreen();

        setTimeout(() => {
            this.currentView = 'home_view';
            this.outputToScreen();
        }, 1000);
    }

    launchApp(appId) {
        const app = this.apps.find(app => app.getID() == appId);
        if (app) {
            const appViewName = `app#${appId}`;
            this.views[appViewName] = app;
            this.switchToView(appViewName);
        }
    }

    getApps() {
        return this.apps;
    }

    getWallpaper() {
        return 'https://wallpaperaccess.com/full/449278.jpg';
    }

    initButtonListeners() {
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => {
                this.switchToView('menu_view');
            });
        }

        if (this.toggleHomeMenuButton) {
            this.toggleHomeMenuButton.addEventListener('click', () => {
                if (this.currentView === 'home_view') {
                    this.switchToView('menu_view');
                } else {
                    this.switchToView('home_view');
                }
            });
        }

        if (this.homeKey) {
            this.homeKey.addEventListener('click', () => {
                this.switchToView('home_view');
            });
        }
    }

    outputToScreen() {
        const date = new Date();

        const viewObj = this.views[this.currentView];
        const html = viewObj.render().toDOM();
        
        html.querySelectorAll('[click]').forEach(e => {
            const callback = e.getAttribute('click');
            e.addEventListener('click', () => viewObj[callback].call(viewObj, e));
        });

        this.phoneScreen.innerHTML = (`
            <div id="os-root">
                <div id="top">
                    <span>${date.getHours()}:${date.getMinutes()}</span>
                    <span class="right">100%</span>
                </div>
                <div id="viewport"></div>
            </div>
        `);
        this.phoneScreen.querySelector('#viewport').appendChild(html);
    }
}

class BootView {
    render() {
        return (`
            <div class="bootview">
                <div>Mobile OS booting...</div>
            </div>
        `);
    }
}

class HomeView {
    constructor(os) {
        this.os = os;
    }

    render() {
        const date = new Date();

        return (`
            <div class="homescreen">
                <img src="${this.os.getWallpaper()}" class="wallpaper" />
                <div class="inner">
                    <div class="time">${date.getHours()}:${date.getMinutes()}</div>
                    <div class="date">${date.getDay()} - ${date.getMonth()} - ${date.getFullYear()}</div>
                </div>
            </div>
        `);
    }
}

class MenuView {
    constructor(os) {
        this.os = os;
    }

    onMenuClick(menu) {
        const appId = menu.getAttribute('data-app-id');
        this.os.launchApp(appId);
    }

    render() {
        const apps = this.os.getApps();

        return (`
            <div class="menuview">
                <img src="${this.os.getWallpaper()}" class="wallpaper" />
                <div class="inner">
                    <div class="scrollable">
                        ${apps.map(app => `
                            <a
                                href="#"
                                class="menu-icon"
                                click="onMenuClick"
                                data-app-id="${app.getID()}"
                            ><span class="icon"><img src="${app.getIcon()}" /></span><br/><span class="name">${app.getName()}</span></a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);
    }
}

class App {
    constructor() {
        this.id = Math.random();
    }

    getID() {
        return this.id;
    }

    getIcon() {
        return this.icon;
    }

    getName() {
        return this.name;
    }
}

class Nairaland extends App {
    constructor() {
        super();

        this.icon = 'https://cdn1.iconfinder.com/data/icons/social-media-2112/29/Asset_2-512.png';
        this.name = 'Nairaland';
    }

    render() {
        return (`
            <div class="app-container nairaland">
                <iframe src="https://nairaland.com"></iframe>
            </div>
        `);
    }
}

class Twitter extends App {
    constructor() {
        super();

        this.icon = '';
        this.name = 'Twitter';
    }

    render() {
        return (`
            <div class="app-container">Welcome to twitter app</div>
        `);
    }
}

class Google extends App {
    constructor() {
        super();

        this.icon = '';
        this.name = 'Google';
    }

    render() {
        return (`
            <div class="app-container">Welcome to google app</div>
        `);
    }
}
