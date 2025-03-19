export default class FlavorIconButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          padding: 4px;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        } 

        button {
          align-items: center;
          background: none;
          border: solid 1px transparent;
          border-radius: 40px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          margin: 0;
          min-width: 40px;
          outline: none;
          padding: 0;
          --icon-cursor: pointer;
        }

        :host( [disabled] ) button {
          cursor: not-allowed;
          opacity: 0.38;
          --icon-cursor: not-allowed;
        }

        :host( [filled] ) button {
          background-color: var( --icon-button-surface-color, #504534 );
          --icon-color: #ffffff;
        }

        :host( [disabled][filled] ) button {
          background-color: var( --icon-button-surface-color, #5045341e );
        }        

        :host( [outlined] ) button {
          border-color: var( --icon-button-surface-color, #504534 );
        }
      </style>
      <button part="button" type="button">
        <slot></slot>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
  }

  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
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
    this._upgrade( 'disabled' );    
    this._upgrade( 'filled' );                
    this._upgrade( 'hidden' );      
    this._upgrade( 'outlined' );                    
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'filled',
      'hidden',
      'outlined'
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
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }

  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
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

  get outlined() {
    return this.hasAttribute( 'outlined' );
  }

  set outlined( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'outlined' );
      } else {
        this.setAttribute( 'outlined', '' );
      }
    } else {
      this.removeAttribute( 'outlined' );
    }
  }
}

window.customElements.define( 'fa-icon-button', FlavorIconButton );
