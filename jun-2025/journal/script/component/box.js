export default class PrimateBox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        ape-label {
          flex-basis: 0;
          flex-grow: 1;
        }
          
        div {
          box-sizing: border-box;          
          display: flex;
          flex-direction: row;
        }

        div[part=box] {
          flex-basis: 0;          
          flex-grow: 1;          
        }

        div[part=group] {        
          align-items: center;
        }

        :host( [carded] ) div[part=box] {
          background: var( --box-background-color, #ffffff );
          border-style: var( --box-order-style, solid );
          border-color: var( --box-border-color, #e0e0e0 );
          border-width: var( --box-border-color, 1px );
          border-radius: var( --box-border-radius, 4px );
          flex-direction: column;
        }

        :host( [centered] ) div[part=box] {
          align-items: center;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [direction=column] ) div[part=box] {
          flex-direction: column;
        }
        :host( [direction=column-reverse] ) div[part=box] {
          flex-direction: column-reverse;
        }        
        :host( [direction=row-reverse] ) div[part=box] {
          flex-direction: row-reverse;
        }                

        :host( [hidden] ) {
          display: none;
        }

        :host( [justified] ) div[part=box] {
          justify-content: center;
        }

        :host( [grow] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [gap=xs] ) div[part=box] {
          gap: 2px;
        }
        :host( [gap=s] ) div[part=box] {
          gap: 4px;
        }       
        :host( [gap=m] ) div[part=box] {
          gap: 8px;
        }       
        :host( [gap=l] ) div[part=box] {
          gap: 16px;
        }        
        :host( [gap=xl] ) div[part=box] {
          gap: 32px;
        }        

        :host( :not( [label] ) ) sa-label {
          display: none;
        }
      </style>
      <div part="group">
        <ape-label exportparts="label: p" part="label"></ape-label>
        <slot name="prefix"></slot>
      </div>
      <div part="box">
        <slot></slot>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'ape-label' );
  }

  // When attributes change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'carded' );      
    this._upgrade( 'centered' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'direction' );      
    this._upgrade( 'gap' );        
    this._upgrade( 'grow' );            
    this._upgrade( 'hidden' );  
    this._upgrade( 'justified' );   
    this._upgrade( 'label' );     
    this._render();  
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'carded',
      'centered',
      'concealed',
      'direction',
      'gap',      
      'grow',
      'hidden',
      'justified',
      'label'
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
  get carded() {
    return this.hasAttribute( 'carded' );
  }

  set carded( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'carded' );
      } else {
        this.setAttribute( 'carded', '' );
      }
    } else {
      this.removeAttribute( 'carded' );
    }
  }

  get centered() {
    return this.hasAttribute( 'centered' );
  }

  set centered( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'centered' );
      } else {
        this.setAttribute( 'centered', '' );
      }
    } else {
      this.removeAttribute( 'centered' );
    }
  }

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

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
    }
  }    

  get gap() {
    if( this.hasAttribute( 'gap' ) ) {
      return this.getAttribute( 'gap' );
    }

    return null;
  }

  set gap( value ) {
    if( value !== null ) {
      this.setAttribute( 'gap', value );
    } else {
      this.removeAttribute( 'gap' );
    }
  }   

  get grow() {
    return this.hasAttribute( 'grow' );
  }

  set grow( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'grow' );
      } else {
        this.setAttribute( 'grow', '' );
      }
    } else {
      this.removeAttribute( 'grow' );
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

  get justified() {
    return this.hasAttribute( 'justified' );
  }

  set justified( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'justified' );
      } else {
        this.setAttribute( 'justified', '' );
      }
    } else {
      this.removeAttribute( 'justified' );
    }
  }    

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }  
}

window.customElements.define( 'ape-box', PrimateBox );
