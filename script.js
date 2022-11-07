/**
 * Created by daniel on 07/04/2017.
 *
 */
class Utilities {

  /**
   * Fill with zero of the values minor that 10
   *
   * @param value
   * @returns {*}
   */
  static zeroPad(value) {
    return value < 10 ? `0${value}` : value;
  }

  static uuid() {
    // generate a random GUID http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

      let r = Math.random() * 16 | 0,
      v = c === 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  static store(namespace, data) {
    var store;

    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    store = localStorage[namespace];
    return store && JSON.parse(store) || [];
  }}


class Display extends React.Component {

  /**
   * Render the display component
   *
   * @returns {XML}
   */
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "display" }, /*#__PURE__*/
      React.createElement("div", { className: "state" }, this.props.running ? 'Running' : 'Stop'), /*#__PURE__*/
      React.createElement("div", { className: "segments" }, /*#__PURE__*/
      React.createElement("span", { className: "minutes" }, Utilities.zeroPad(this.props.minutes)), ":", /*#__PURE__*/
      React.createElement("span", { className: "seconds" }, Utilities.zeroPad(this.props.seconds)), ".", /*#__PURE__*/
      React.createElement("span", { className: "millis" }, Utilities.zeroPad(this.props.millis)))));



  }}


class Header extends React.Component {

  render() {
    return /*#__PURE__*/(
      React.createElement("header", { className: "header" }, /*#__PURE__*/
      React.createElement("h1", { className: "title" }, this.props.title, " ", this.props.version), /*#__PURE__*/
      React.createElement("button", { className: "btn-menu" }, /*#__PURE__*/
      React.createElement("div", null), /*#__PURE__*/
      React.createElement("div", null), /*#__PURE__*/
      React.createElement("div", null))));



  }}


class ListView extends React.Component {

  /**
   * Constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);

    this.state = {
      selected: '' };

  }

  /**
   * Handler
   *
   * @param event
   * @private
   */
  handleClick(event) {
    this.setState({
      selected: event.target.dataset.selected });

  }

  /**
   * Handler
   *
   * @param index
   */
  handleRemoveClick(index) {
    /*console.log(`Remove item of ${index}`);*/
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    let _this = this;
    let items = this.props.items.map((item, index) => {
      let classes = ['list-item'];

      if (item.id === _this.state.selected) {
        classes.push('selected');
      }

      return /*#__PURE__*/(
        React.createElement("li", { className: classes.join(' '), key: `key-${index}`, "data-selected": item.id,
          onClick: _this.handleClick }, /*#__PURE__*/
        React.createElement("div", { className: "counter" }, `Lap ${++index}`), /*#__PURE__*/
        React.createElement("div", { className: "right" }, item.text)));


    });

    return /*#__PURE__*/(
      React.createElement("div", { className: "list-view" }, /*#__PURE__*/
      React.createElement("div", { className: "container" }, /*#__PURE__*/
      React.createElement("ul", { className: "list-items" },
      items))));




  }}


class MainView extends React.Component {

  /**
   * Constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.store = Utilities.store('chronometer-app');

    this.state = {
      minutes: 0,
      seconds: 0,
      millis: 0,
      running: false,
      items: this.store };


    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  /**
   * Handler
   *
   * @param event
   * @private
   */
  handleResetClick(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.setState({
      millis: 0,
      seconds: 0,
      minutes: 0 });

  }

  /**
   * Handler
   *
   * @param event
   * @private
   */
  handleStartClick(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (!this.running) {
      this.running = true;
    }
  }

  /**
   * Handler
   *
   * @param event
   * @private
   */
  handleStopClick(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (this.running) {
      this.running = false;

      let items = this.state.items.concat({
        id: Utilities.uuid(),
        text: this.getTimeAsString() });


      this.setState({
        items: items });


      Utilities.store('chronometer-app', items);
    }
  }

  /**
   * Gets or sets the running property
   *
   * @returns {*}
   */
  get running() {
    return this._running;
  }

  /**
   * Gets or sets the running property
   *
   * @param value
   */
  set running(value) {

    this._running = value;

    if (true === value) {

      this.interval = setInterval(() => {
        this.tick();
      }, 50); // 1000 / 20 = 50 millis repeat

      this.setState({ running: value });
    } else {

      if (this.interval) {
        clearInterval(this.interval);
      }

      this.setState({ running: value });
    }
  }

  tick() {
    let millis = this.state.millis + 1;
    let seconds = this.state.seconds;
    let minutes = this.state.minutes;

    if (millis === 10) {
      millis = 0;
      seconds += 1;
    }

    if (seconds === 60) {
      millis = 0;
      seconds = 0;
      minutes += 1;
    }

    this.setState({
      millis: millis,
      seconds: seconds,
      minutes: minutes });

  }

  /**
   * Get time as string
   *
   * @returns {*}
   */
  getTimeAsString() {
    return `${Utilities.zeroPad(this.state.minutes)}:${Utilities.zeroPad(this.state.seconds)}.${Utilities.zeroPad(this.state.millis)}`;
  }

  /**
   * Render the View
   *
   * @returns {XML}
   */
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "chronometer" }, /*#__PURE__*/
      React.createElement(Header, { title: this.props.title }), /*#__PURE__*/

      React.createElement("main", { className: "main" }, /*#__PURE__*/
      React.createElement(Display, { minutes: this.state.minutes,
        seconds: this.state.seconds,
        millis: this.state.millis,
        running: this.state.running }), /*#__PURE__*/


      React.createElement("div", { className: "actions" }, /*#__PURE__*/
      React.createElement("button", { className: "btn start btn-green " + (this.state.running ? 'disabled' : ''),
        onClick: this.handleStartClick }, "INICIAR"), /*#__PURE__*/

      React.createElement("button", { className: "btn stop " + (false === this.state.running ? 'disabled' : ''),
        onClick: this.handleStopClick }, "DETENER"), /*#__PURE__*/

      React.createElement("button", { className: "btn reset " + (this.state.seconds > 0 && false === this.state.running ? '' : 'disabled'),
        onClick: this.handleResetClick }, "RENICIA")), /*#__PURE__*/


      React.createElement(ListView, { items: this.state.items }))));



  }}


class App extends React.Component {

  render() {
    return /*#__PURE__*/(
      React.createElement(MainView, { version: this.props.version, start: "true", title: "Chronometer" }));

  }}


ReactDOM.render( /*#__PURE__*/
React.createElement(App, { version: "2.0" }),
document.querySelector('#root'));