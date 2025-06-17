export default class Carousel extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 320px;
          overflow: hidden;
          position: relative;
          width: 320px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-self: center;
          background: none;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 24px;
          border: none;
          cursor: pointer;
          height: 96px;
          margin: 0;
          padding: 0;
          outline: none;
          width: 48px;
        }

        button:hover {
          background-color: rgba( 255, 255, 255, 0.20 );
        }

        div {
          display: flex;
          flex-basis: 0;
          flex-grow: 1;
          justify-content: center;
        }

        ::slotted( img ) {
          height: 100%;
          object-fit: cover;
          object-position: top;
          width: 100%;
        }

        .next {
          background-image: url( img/next.svg );          
          border-bottom-right-radius: 48px;
          border-top-right-radius: 48px;          
        }

        .previous {
          background-image: url( img/previous.svg );
          border-bottom-left-radius: 48px;
          border-top-left-radius: 48px;
        }        
      </style>
      <button class="previous"></button>
      <div>
        <slot></slot>
      </div>
      <button class="next"></button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$next = this.shadowRoot.querySelector( 'button:last-of-type' );
    this.$next.addEventListener( 'click', () => {
      const index = this.selectedIndex === null ? 0 : this.selectedIndex;
      this.selectedIndex = index === this.children.length - 1 ? 0 : index + 1;
    } );

    this.$previous = this.shadowRoot.querySelector( 'button:first-of-type' );
    this.$previous.addEventListener( 'click', () => {
      const index = this.selectedIndex === null ? 0 : this.selectedIndex;
      this.selectedIndex = index === 0 ? this.children.length - 1 : index - 1;
    } );

    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchanged', () => {
      this._render();
    } );
  }

  // When attributes change
  _render() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;

    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].style.display = c === index ? 'block' : 'none';
    }
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'selectedIndex' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'selected-index'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }  

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }      

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }          
}

window.customElements.define( 'tb-carousel', Carousel );
