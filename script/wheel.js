export default class Wheel extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          background: none;
          background-color: #0181F5;
          border: none;
          border-radius: 48px;
          box-shadow: 
            0px 3px 1px -2px rgba( 0, 0, 0, 0.20 ), 
            0px 2px 2px 0px rgba( 0, 0, 0, 0.14 ), 
            0px 1px 5px 0px rgba( 0, 0, 0, 0.12 );  
          box-sizing: border-box;
          color: #ffffff;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          height: 48px;
          margin: 0;
          margin-bottom: 14px;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
          width: 48px;
          -webkit-font-smoothing: antialiased;            
          -webkit-tap-highlight-color: transparent;            
        }              

        button:last-of-type {
          margin-bottom: 0;
        }

        div {
          align-items: center;          
          display: flex;
          flex-direction: column;
          left: 136px;
          position: absolute;
          top: 0;
          z-index: 200;                    
        }

        path {
          fill: rgba( 0, 0, 0, 0.12 );
          stroke: #000000;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3px;          
        }

        rect {
          fill: #757575;
        }

        svg {
          margin: 17px 0 0 0;
        }

        #chart {
          transition: transform 400ms ease-out;
        }

        #spokes circle {
          fill: #ffffff;
          stroke: #727272;          
        }

        #wheel circle {
          fill: none;
          stroke: #727272;
        }              
      </style>
      <svg>
        <g id="chart">        
          <g id="wheel"></g>
          <g id="spokes"></g>
          <path />
        </g>
      </svg>
      <div>
        <button data-value="5">5</button>
        <button data-value="4">4</button>
        <button data-value="3">3</button>
        <button data-value="2">2</button>
        <button data-value="1">1</button>        
      </div>             
    `;

    // Private
    this._radius = 150;
    this._selectedIndex = 0;
    this._start = null;
    this._steps = 0;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;    
    this._value = new Array( 16 ).fill( 0 );    

    // Events
    this.doRatingClick = this.doRatingClick.bind( this );    
    this.doTouchEnd = this.doTouchEnd.bind( this );
    this.doTouchMove = this.doTouchMove.bind( this );
    this.doTouchStart = this.doTouchStart.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements    
    this.$svg = this.shadowRoot.querySelector( 'svg' );
    this.$svg.setAttribute( 'width',  320 );
    this.$svg.setAttribute( 'height', 303 );
    this.$chart = this.shadowRoot.querySelector( '#chart' );
    this.$wheel = this.shadowRoot.querySelector( '#wheel' );
    this.$spokes = this.shadowRoot.querySelector( '#spokes' );
    this.$path = this.shadowRoot.querySelector( 'path' );    
    this.$buttons = this.shadowRoot.querySelectorAll( 'button' );    
  }

  clear( reset = false ) {
    this.$path.setAttributeNS( null, 'd', '' );

    if( reset ) {
      this.selectedIndex = 0;      
      this.value = null;
    }
  }  

  left() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    const spokes = this.spokes === null ? 16 : this.spokes;    
    this.selectedIndex = index === ( spokes - 1 ) ? 0 : index + 1;
  }

  right() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    const spokes = this.spokes === null ? 16 : this.spokes;
    this.selectedIndex = index === 0 ? ( spokes - 1 ) : index - 1;
  }

  _chart() {
    const radius = 147;
    const spokes = this.spokes === null ? 16 : this.spokes;
    const maximum = this.maximum === null ? 5 : this.maximum;
    const slice = ( 360 / spokes ) * ( Math.PI / 180 );
    let d = null;    

    if( this.value === null ) {
      this.$path.setAttributeNS( null, 'd', '' );    
      return;
    }

    // Iterate values
    for( let v = 0; v < this._value.length; v++ ) {
      // Allow close-to-zero value for zero
      // Better charting visualization
      const value = this._value[v] === 0 ? 0.25 : this._value[v];

      const segment = ( radius / maximum ) * value;
      const current = {
        x: segment * Math.cos( ( slice * v ) - 1.5708 ),
        y: segment * Math.sin( ( slice * v ) - 1.5708 )
      };

      if( v === 0 ) {
        d = `M ${current.x} ${current.y} `;
      } else {
        d = d + `L ${current.x} ${current.y} `;
      }
    }

    // Assign path
    // Will update chart
    // Will not run render
    this.$path.setAttributeNS( null, 'd', d + ' Z' );    
  }

  _circles() {
    const maximum = this.maximum === null ? 5 : this.maximum;

    if( this.$wheel.children.length === maximum ) 
      return;

    while( this.$wheel.children.length > maximum )
      this.$wheel.children[0].remove();

    while( this.$wheel.children.length < maximum ) {
      const circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
      circle.setAttributeNS( null, 'cx', 0 );
      circle.setAttributeNS( null, 'cy', 0 );
      this.$wheel.appendChild( circle );
    }

    for( let c = 0; c < this.$wheel.children.length; c++ ) {
      this.$wheel.children[c].setAttributeNS( null, 'r', ( ( this._radius - 3 ) / maximum ) * ( c + 1 ) );
      this.$wheel.children[c].setAttributeNS( null, 'stroke-width', c === ( maximum - 1 ) ? 3 : 1 );      
    }
  }

  _place() {
    const spokes = this.spokes === null ? 16 : this.spokes;

    this.$chart.style.transform = `
      translate( 160px, 320px ) 
      scale( 2.13 )
      rotate( ${this._steps * ( 360 / spokes )}deg )          
    `;
  }

  _spokes() {
    const maximum = this.maximum === null ? 5 : this.maximum;    
    const spokes = this.spokes === null ? 16 : this.spokes;

    if( this.$spokes.children.length === spokes ) 
      return;

    while( this.$spokes.children.length > spokes )
      this.$spokes.children[0].remove();

    while( this.$spokes.children.length < spokes ) {
      const spoke = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
      
      const rect = document.createElementNS( 'http://www.w3.org/2000/svg', 'rect' );
      rect.setAttributeNS( null, 'x', -0.50 );
      rect.setAttributeNS( null, 'width', 1 );
      rect.setAttributeNS( null, 'height', this._radius - 3 );
      spoke.appendChild( rect );

      for( let d = 0; d < maximum; d++ ) {
        const dot = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
        dot.setAttributeNS( null, 'cy', ( ( this._radius - 3 ) / maximum ) * ( d + 1 ) );
        dot.setAttributeNS( null, 'r', 2 );
        spoke.appendChild( dot );
      }

      this.$spokes.appendChild( spoke );
    }

    // Position (rotate) the spokes
    for( let s = 0; s < this.$spokes.children.length; s++ ) {
      this.$spokes.children[s].setAttributeNS( null, 'transform', `rotate( ${( 360 / spokes ) * s} )` );
    }  
  }  

  doRatingClick( evt ) {
    const rating = parseInt( evt.target.getAttribute( 'data-value' ) );
    this._value[this._selectedIndex] = this._value[this._selectedIndex] === rating ? 0 : rating;
    this._chart();
    this.left();

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: this._selectedIndex
    } ) ); 
  }

  doTouchEnd( evt ) {
    this._start = null;

    document.removeEventListener( this._touch ? 'touchmove' : 'mousemove', this.doTouchMove );
    document.removeEventListener( this._touch ? 'touchend' : 'mouseup', this.doTouchEnd );
  }

  doTouchMove( evt ) {

  }

  doTouchStart( evt ) {
    this._start = {
      center: {
        x: this.$chart.clientWidth / 2,
        y: this.$chart.clientHeight / 2
      },
      touch: {
        x: evt.changedTouches[0].clientX,
        y: evt.changedTouches[0].clientY
      }
    };

    console.log( this._start );

    document.addEventListener( this._touch ? 'touchmove' : 'mousemove', this.doTouchMove );
    document.addEventListener( this._touch ? 'touchend' : 'mouseup', this.doTouchEnd );
  }

  // When attributes change
  _render() {
    this._circles();
    this._spokes();
    this._chart();
    this._place();            
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
    this.$svg.addEventListener( this._touch ? 'touchstart' : 'mousedown', this.doTouchStart );

    for( let b = 0; b < this.$buttons.length; b++ )
      this.$buttons[b].addEventListener( 'click', ( evt ) => this.doRatingClick( evt ) );

    this._upgrade( 'concealed' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'maximum' );    
    this._upgrade( 'selectedIndex' );    
    this._upgrade( 'spokes' );            
    this._upgrade( 'value' );                

    this._render();
  }

  disconnectedCallback() {
    this.$chart.removeEventListener( this._touch ? 'touchstart' : 'mousedown', this.doTouchStart );

    for( let b = 0; b < this.$buttons.length; b++ )
      this.$buttons[b].removeEventListener( 'click', ( evt ) => this.doRatingClick( evt ) );        
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'maximum',
      'spokes'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Object
  get selectedIndex() {
    return this._selectedIndex;
  }

  set selectedIndex( value ) {
    // https://math.stackexchange.com/questions/110080/shortest-way-to-achieve-target-angle
    const spokes = this.spokes === null ? 16 : this.spokes;
    const values = [
      value - this._selectedIndex,
      value - this._selectedIndex + spokes,
      value - this._selectedIndex - spokes
    ];
    let index = null;
    let smallest = null;

    for( let v = 0; v < values.length; v++ ) {
      if( smallest === null ) {
        smallest = values[v]
        index = v;
      } else {
        if( Math.abs( values[v] ) < Math.abs( smallest ) ) {
          smallest = values[v];
          index = v;
        }
      }
    }

    this._steps = this._steps - values[index];
    this._selectedIndex = value;
    
    this._place();
  }

  get value() {
    const found = this._value.find( rating => rating !== 0 );
    return found ? this._value : null;
  }

  set value( content ) {
    let spokes = this.spokes === null ? 16 : this.spokes;
    this._value = content === null ? new Array( spokes ).fill( 0 ) : [... content];
    this._chart();
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

  get maximum() {
    if( this.hasAttribute( 'maximum' ) ) {
      return parseInt( this.getAttribute( 'maximum' ) );
    }

    return null;
  }

  set maximum( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum', value );
    } else {
      this.removeAttribute( 'maximum' );
    }
  }          

  get spokes() {
    if( this.hasAttribute( 'spokes' ) ) {
      return parseInt( this.getAttribute( 'spokes' ) );
    }

    return null;
  }

  set spokes( value ) {
    if( value !== null ) {
      this.setAttribute( 'spokes', value );
    } else {
      this.removeAttribute( 'spokes' );
    }
  }           
}

window.customElements.define( 'tb-wheel', Wheel );
