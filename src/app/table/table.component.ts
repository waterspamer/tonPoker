import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  ViewChild,
  input,
  output,
} from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GameService } from '../shared/game.service';

const VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const FRAGMENT_SHADER = `
    uniform sampler2D cardTexture;
    uniform float offsetX;
    uniform float offsetY;
    varying vec2 vUv;
    void main() {
        vec2 uv = vUv;
        if (!gl_FrontFacing) {
            uv.x = vUv.x + 0.3825;
            uv.y = vUv.y - 0.543;
        } else {
            uv.x = vUv.x + offsetX;
            uv.y = vUv.y + offsetY;
        }
        gl_FragColor = texture2D(cardTexture, uv);
    }
`;

@Component({
  selector: 'table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements AfterViewInit {
  texture = input<string>('../../assets/resources/tableTex.png');
  loadingProgress = output<number>();
  loaded = output<void>();

  @ViewChild('canvas') private _canvasRef!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    // event.target.innerWidth;
  }

  // @HostListener('window:resize', ['$event.target.innerWidth'])
  // onResize(width: number) {
  //   console.log(width);
  // }

  private _camera!: THREE.PerspectiveCamera;

  private get _canvas(): HTMLCanvasElement {
    return this._canvasRef.nativeElement;
  }

  private _loader = new THREE.TextureLoader();
  private _fbxLoader = new FBXLoader();
  private _geometry = new THREE.BoxGeometry(1, 1, 1);
  private _material = new THREE.MeshBasicMaterial({ map: this._loader.load(this.texture()) });

  private _renderer!: THREE.WebGLRenderer;

  private _scene!: THREE.Scene;

  private cardObjects: any[] = [];
  private cardsIndexes: number[] = [];

  constructor(private readonly _gameService: GameService) {
    this._gameService.gameStart$.subscribe(() => {
      this._generateCardsInef();
    });
  }

  public ngAfterViewInit(): void {
    this._createScene();
    this._animate();
  }

  private _createScene(): void {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    this._camera.position.z = 5;
    this._camera.position.y = 3;
    this._camera.rotation.x = -0.2;

    // this._camera.

    const tableTexture = this._loader.load('../../assets/resources/tableTex.png');

    const material = new THREE.MeshBasicMaterial({ map: tableTexture });

    this._fbxLoader.load(
      '../../assets/resources/table.fbx',
      object => {
        object.traverse(function (child: any) {
          console.log(child);
          // if (child typeof)

          if (child.isMesh) {
            child.material = material;
            if (child.material) {
              child.material.transparent = false;
            }
          }
        });
        object.scale.set(0.1, 0.1, 0.1);
        object.rotation.set(0, Math.PI / 2, 0);
        object.position.y = -2;
        object.position.z = -3;
        this._scene.add(object);
      },
      xhr => {
        const progress = Math.round((xhr.loaded / xhr.total) * 100);

        console.log(progress);

        this.loadingProgress.emit(progress);

        if (progress === 100) {
          this.loaded.emit();
        }
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      error => {
        console.log(error);
      },
    );
    // this._renderer.render(this._scene, this._camera);
  }

  private _animate(): void {
    requestAnimationFrame(() => this._animate());
    this._renderer.render(this._scene, this._camera);
  }

  private _generateCardsInef() {
    this.cardObjects.forEach(card => {
      this._scene.remove(card);
    });

    this.cardObjects = [];
    this.cardsIndexes = [];

    const cardTexture = this._loader.load('../../assets/resources/texturePack.jpg');

    this._fbxLoader.load('../../assets/resources/card.fbx', object => {
      const cardWidth = 0.6;
      const cardHeight = 1.04;
      const suits = 4;
      const ranks = 13;
      const uvYOffset = 0.1365;
      const uvXOffset = 0.07225;

      let i = 0;

      for (let suit = 0; suit < suits; suit++) {
        for (let rank = 0; rank < ranks; rank++) {
          const card = object.clone(true);

          const material = new THREE.ShaderMaterial({
            uniforms: {
              cardTexture: { value: cardTexture },
              offsetX: { value: uvXOffset * rank },
              offsetY: { value: -uvYOffset * suit },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            side: THREE.DoubleSide,
          });

          card.traverse((child: any) => {
            if (child.isMesh) {
              child.scale.set(10, 10, 10);
              child.rotation.set(Math.PI / 2, 0, 0);
              child.material = material;
            }
          });

          const posX = rank * (cardWidth + 0.1);
          const posY = suit * (cardHeight + 0.1);

          card.position.set(0, this.cardObjects.length * 0.002 - 0.45, -2);
          //gsap.to(card.rotation, { duration: .3, x: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: (suit * ranks + rank) * 0.05 });

          this.cardObjects.push(card);
          this.cardsIndexes.push(i);

          i++;

          this._scene.add(card);
        }
      }
    });

    setTimeout(() => {
      this._shuffleCards();
    }, 500);

    // раздаем карты игроку
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[51]].position, {
        duration: 0.2,
        x: -0.25,
        y: 0.15,
        z: 3,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[50]].position, {
        duration: 0.2,
        x: 0.25,
        y: 0.15,
        z: 3.01,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.5,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[51]].rotation, {
        duration: 0.2,
        x: Math.PI / 4,
        y: Math.PI + 0.1,
        z: Math.PI,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[50]].rotation, {
        duration: 0.2,
        x: Math.PI / 4,
        y: Math.PI - 0.1,
        z: Math.PI,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.5,
      });
      // document.getElementById('playercards').innerText = `игрок: ${stringifyNominal(
      //   getCardNominal(51),
      // )}, ${stringifyNominal(getCardNominal(50))} `;
    }, 2000);

    //раздаем две карты дилеру
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[49]].position, {
        duration: 0.2,
        x: -0.35,
        y: -0.45,
        z: -0.5,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[48]].position, {
        duration: 0.2,
        x: 0.35,
        y: -0.45,
        z: -0.5,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.5,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[49]].rotation, {
        duration: 0.2,
        x: 0,
        y: 0,
        z: 0,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1,
      });
      gsap.to(this.cardObjects[this.cardsIndexes[48]].rotation, {
        duration: 0.2,
        x: 0,
        y: 0,
        z: 0,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.5,
      });
      // document.getElementById('dealercards').innerText = `дилер: *, * `;
    }, 2000);

    //раздаем 3 карты на стол
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[47]].position, {
        duration: 0.3,
        x: -1.4,
        y: -0.45,
        z: 1,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2,
      });
    }, 2000);
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[47]].rotation, {
        duration: 0.3,
        z: -Math.PI,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2,
      });
    }, 2000);

    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[46]].position, {
        duration: 0.3,
        x: -0.7,
        y: -0.45,
        z: 1,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2.3,
      });
    }, 2000);
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[46]].rotation, {
        duration: 0.3,
        z: -Math.PI,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2.3,
      });
    }, 2000);

    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[45]].position, {
        duration: 0.3,
        x: 0,
        y: -0.45,
        z: 1,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2.6,
      });
    }, 2000);
    setTimeout(() => {
      gsap.to(this.cardObjects[this.cardsIndexes[45]].rotation, {
        duration: 0.3,
        z: -Math.PI,
        repeat: 0,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 2.6,
      });
      // document.getElementById('tablecards').innerText = `стол: ${stringifyNominal(
      //   getCardNominal(47),
      // )}, ${stringifyNominal(getCardNominal(46))}, ${stringifyNominal(getCardNominal(45))}`;
    }, 2000);
  }

  private _shuffleCards() {
    this.cardsIndexes = this._shuffleArray(this.cardsIndexes);

    for (let i = 0; i < 52; i++) {
      gsap.to(this.cardObjects[i].position, { duration: 0.1, y: this.cardsIndexes[i] * 0.005 - 0.45, delay: i * 0.01 });
      gsap.to(this.cardObjects[i].position, { duration: 0.1, y: this.cardsIndexes[i] * 0.002 - 0.45, delay: i * 0.02 });
      //translateCard(cardObjects[i], (1,cardsIndexes[i] * 0.002 -.45,2), i * 0.02, 1);
    }
  }

  private _shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
