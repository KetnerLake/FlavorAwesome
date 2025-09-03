export default class Carousel extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          width: 320px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        .dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 16px 0;
          margin-top: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }

        .dot:hover {
          background: #94a3b8;
          transform: scale(1.25);
        }

        .dot.active {
          background: #3b82f6;
          transform: scale(1.4);
        }

        .content {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 320px;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }

        ::slotted( img ) {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          object-fit: cover;
          object-position: center;
          width: 100%;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }

        ::slotted( img[data-visible] ) {
          opacity: 1;
        }

        
      </style>
      <div class="content">
        <slot></slot>
      </div>
      <div class="dots"></div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchanged', () => {
      this._setupDots();
      this._render();
    } );

    this.$dotsContainer = this.shadowRoot.querySelector( '.dots' );
    
    // Auto-advance timer
    this._autoAdvanceInterval = null;
  }

  // Setup dots based on children
  _setupDots() {
    this.$dotsContainer.innerHTML = '';
    
    for( let i = 0; i < this.children.length; i++ ) {
      const dot = document.createElement( 'div' );
      dot.className = 'dot';
      dot.addEventListener( 'click', () => {
        this._pauseAutoAdvance();
        this.selectedIndex = i;
        this._startAutoAdvance();
      } );
      this.$dotsContainer.appendChild( dot );
    }
  }

  // When attributes change
  _render() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;

    // Update image visibility with smooth transition
    for( let c = 0; c < this.children.length; c++ ) {
      const img = this.children[c];
      if( c === index ) {
        img.setAttribute( 'data-visible', '' );
      } else {
        img.removeAttribute( 'data-visible' );
      }
    }

    // Update dots
    const dots = this.$dotsContainer.querySelectorAll( '.dot' );
    dots.forEach( ( dot, i ) => {
      dot.classList.toggle( 'active', i === index );
    } );
  }

  // Auto-advance functionality
  _startAutoAdvance() {
    this._pauseAutoAdvance();
    this._autoAdvanceInterval = setInterval( () => {
      const currentIndex = this.selectedIndex === null ? 0 : this.selectedIndex;
      this.selectedIndex = currentIndex === this.children.length - 1 ? 0 : currentIndex + 1;
    }, 4000 ); // Change slide every 4 seconds
  }

  _pauseAutoAdvance() {
    if( this._autoAdvanceInterval ) {
      clearInterval( this._autoAdvanceInterval );
      this._autoAdvanceInterval = null;
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
    
    // Setup dots after a short delay to ensure children are ready
    setTimeout( () => {
      this._setupDots();
      this._render();
      // Start auto-advance after initial render
      setTimeout( () => this._startAutoAdvance(), 500 );
    }, 100 );
    
    // Pause auto-advance on hover
    this.addEventListener( 'mouseenter', () => this._pauseAutoAdvance() );
    this.addEventListener( 'mouseleave', () => this._startAutoAdvance() );
  }

  // Cleanup
  disconnectedCallback() {
    this._pauseAutoAdvance();
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
