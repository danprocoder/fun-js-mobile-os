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
        new Nairaland(this),
        new Gallery(this),
    ];

    settings = {
        wallpaper: 'https://wallpaperaccess.com/full/449278.jpg',
    };

    isBooting = true;

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
            this.isBooting = false;
            
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
            this.outputToScreen();
        }
    }

    getApps() {
        return this.apps;
    }

    getWallpaper() {
        return this.settings.wallpaper;
    }

    setWallpaper(src) {
        this.settings.wallpaper = src;
    }

    initButtonListeners() {
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => {
                if (this.isBooting) return;

                this.switchToView('menu_view');
            });
        }

        if (this.toggleHomeMenuButton) {
            this.toggleHomeMenuButton.addEventListener('click', () => {
                if (this.isBooting) return;

                if (this.currentView === 'home_view') {
                    this.switchToView('menu_view');
                } else if (this.currentView === 'menu_view') {
                    this.switchToView('home_view');
                } else {
                    this.switchToView('menu_view');
                }
            });
        }

        if (this.homeKey) {
            this.homeKey.addEventListener('click', () => {
                if (this.isBooting) return;

                this.switchToView('home_view');
            });
        }
    }

    outputToScreen() {
        const date = new Date();

        const viewObj = this.views[this.currentView];
        const html = viewObj.render().toDOM();

        this.phoneScreen.innerHTML = (`
            <div id="os-root">
                ${!this.isBooting ? (`
                    <div id="top">
                        <span>${date.getHours()}:${date.getMinutes()}</span>
                        <span class="right">100%</span>
                    </div>
                `) : ('')}
                <div id="viewport"></div>
            </div>
        `);

        html.querySelectorAll('[click]').forEach(e => {
            const callback = e.getAttribute('click');
            e.addEventListener('click', (event) => {
                viewObj[callback].call(viewObj, e);

                event.preventDefault();
            });
        });
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
                                data-app-id="${app.id}"
                            ><span class="icon"><img src="${app.icon}" /></span><br/><span class="name">${app.name}</span></a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);
    }
}

class App {
    constructor(os) {
        this.os = os;

        this.id = Math.random();

        this.state = this.getStateProxy();

        if (this.onInit) this.onInit();
    }

    getStateProxy() {
        const os = this.os;

        return new Proxy(this.getInitialState(), {
            set(target, prop, value) {
                const r = Reflect.set(target, prop, value);

                os.outputToScreen();

                return r;
            },

            get(target, prop) {
                return Reflect.get(target, prop);
            }
        });
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

    showIf(condition) {
        return (html) => condition ? html : '';
    }
}

class Nairaland extends App {
    icon = 'https://pbs.twimg.com/profile_images/1150832179/twitter_400x400.png';
    name = 'Nairaland';

    getInitialState() {
        return {};
    }

    render() {
        return (`
            <div class="app-container nairaland">
                <iframe src="https://nairaland.com"></iframe>
            </div>
        `);
    }
}

class Gallery extends App {
    icon = 'http://chittagongit.com/images/iphone-gallery-icon/iphone-gallery-icon-8.jpg';
    name = 'Gallery';

    getInitialState() {
        return {
            images: [
                'https://wallpaperaccess.com/full/449278.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGsE3X3uUe5-PMK-AVhLiky7-9cQJg-3GUhOrkpqULj8E4FduC',
                'https://res.cloudinary.com/carsguide/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_large/v1/editorial/2017-Lamborghini-Aventador-S-coupe-blue-1200x800-%284%29.jpg',
                'https://www.geek.com/wp-content/uploads/2019/04/exoplanet-1-625x352.jpg'
            ],
            viewing: null,
            modalOpen: false,
        };
    }

    onImgSelect(e) {
        this.state.viewing = e.getAttribute('data-src');
    }

    showWallpaperModal() {
        this.state.modalOpen = true;
    }

    hideWallpaperModal() {
        this.state.modalOpen = false;
    }

    changeWallpaper() {
        const { viewing } = this.state;

        this.os.setWallpaper(viewing);
        this.state.modalOpen = false;
    }

    goBack() {
        this.state.viewing = null;
    }

    render() {
        const { viewing, images, modalOpen } = this.state;

        return (`
            <div class="app-container gallery">
                ${viewing ? (`
                    <div class="img-full">
                        <a href="#" class="back" click="goBack">&larr;</a>
                        <a href="#" class="set-wallpaper" click="showWallpaperModal" title="Set as Wallpaper">Set as Wallpaper</a>
                        <img src="${viewing}" />
                    </div>
                    ${this.showIf(modalOpen)(`
                        <div class="wallpaper-modal-container">
                            <div class="modal">
                                <div class="question">Do you want to set this as wallpaper?</div>
                                <div class="btn-area">
                                    <a href="#" class="modal-yes" click="changeWallpaper">Yes</a>
                                    <a href="#" class="modal-back" click="hideWallpaperModal">Cancel</a>
                                </div>
                            </div>
                        </div>
                    `)}
                `) : (`
                    <div class="grid">
                        ${images.map(src => (`<span class="img grid-item" click="onImgSelect" data-src="${src}">
                            <img src="${src}" />
                        </span>`)).join('')}
                    </div>
                `)}
            </div>
        `);
    }
}
