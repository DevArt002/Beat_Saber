# Multiplayer Beat Saber

Browser-based Beat Saber multiplayer game with support for 2+ players. The game includes a single audio track synchronized with beats for players to follow. It has been tested and confirmed to work on desktop/laptop computers and the Oculus Quest 2 VR headset.

[**Live Demo**](https://beat-saber.surge.sh/)

[**Desktop Recording**](https://www.veed.io/view/98a48207-0bb0-4b5b-9a14-cc2bd37d7456?sharingWidget=true&panel=share)

[**Oculus Quest 2 Recording**](https://www.veed.io/view/b976acf5-e367-478b-aff3-b3cc11aaea71?sharingWidget=true&panel=share)

### Development

Install dependencies

```
npm i
```

Start dev server

```
npm run start
```

Bundle assets

```
npm run build
```

Full build

```
npm run release
```

### How to play

1. Input a destination peer ID (4 digits) for multiplayer or input 'single' for single-player mode. Press Enter or click the Connect button.
2. Once you are connected to the peer, click the Ready button. The game will start as soon as all other players are ready. If you are using a VR headset, please enter VR mode after clicking the Ready button.
3. On a desktop browser, click once on the game viewport. You can play the game with the mouse, where moving the mouse down or up will move both sabers simultaneously. On a VR headset, you can control your sabers using VR controllers.
4. If you correctly hit a note with the saber that has the same color as the note, you will earn 100 points. If not, you will lose 50 points.
5. You can disconnect at any time by clicking Exit button.

### Technologies/Libraries

- React.js
- Typescript
- Vite
- Three.js
- Tailwind CSS
- ESLint
- Prettier

### What is still missing technically?

- **XR Interaction on HTML element**: In XR mode, users should be able to interact with HTML element properly.
- **Unoptimized RTC**: Every players sends their data every frame.
- **Increasing draw calls**: For multiplayer, each player's rig/sabers and score entities are causing extra draw calls. This can be reduced by using instanced mesh or other approach.
- **Lack of collider types**: Currently, only Box collider is supported. It can be improved by adding support for Plane, Sphere, and Convex colliders.
- **Missing global state management**: Consider using Redux or React Context for sharing states between React components. Additionally, Mobx is suitable for state sharing between Three.js ECS classes and React components.
- etc.
