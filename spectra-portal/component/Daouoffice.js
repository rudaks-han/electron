const { session } = require('electron')

class Daouoffice extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Promise.resolve(this.login)
            .then(this.findList)

    }

    login() {
        console.error('login')
        const username = "xxx";
        const password = "xxx";

        session.defaultSession.cookies.get({ url: 'https://spectra.daouoffice.com' })
            .then((cookies) => {
                console.error('cookies')
                console.log(cookies)
            }).catch((error) => {
            console.log(error)
        })


        axios.post('https://spectra.daouoffice.com/api/login', {
            username,
            password
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        let options = {
            method: 'post',
            url: 'https://spectra.daouoffice.com/api/login',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {'Set-Cookie': guid + '; Path=/'},
            param: param,
            success : (res) => {
                console.error(res);
                /*userInfo.username = username;

                chrome.cookies.get({ url: 'https://spectra.daouoffice.com', name: 'GOSSOcookie' },
                    function (cookie) {
                        if (cookie) {
                            logger.debug("GOSSOcookie : " + cookie.value);
                            //GOSSOcookie = cookie.value;
                        }
                        else {
                            logger.error('Can\'t get cookie! Check the name!');
                        }
                    });

                if (typeof callback == 'function')
                    callback(res);

                firebaseApp.log(username, 'login ok.');*/
            },
            error : (xhr) => {
                console.error('login fialed: ' + xhr);

            }


        };
    }

    findList() {
        console.error('findList');
        /*axios.get('https://spectra.daouoffice.com/api/board/2302/posts?offset=5&page=0&viewtype=')
            .then(response => {
                console.error('response: ' + response)
            })*/
    }

    render() {
        return (
            <div className="ui fluid card">
                <div className="content">
                    <div className="header">
                        <div className="ui red header">
                            Daouoffice
                        </div>
                    </div>
                    <div className="description">
                        <div className="ui list">
                            <div className="item">
                                <a className="header">Header</a>
                                <div className="description">
                                    Click a link in our <a>description</a>.
                                </div>
                            </div>
                            <div className="item">
                                <a className="header">Learn More</a>
                                <div className="description">
                                    Learn more about this site on <a>our FAQ page</a>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui buttons">
                            <button className="ui button">출근하기</button>
                            <div className="or"></div>
                            <button className="ui positive button">퇴근하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Daouoffice />, document.querySelector('#daouoffice'));

