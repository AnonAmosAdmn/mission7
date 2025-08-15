'use client';

import { usePrivy, type CrossAppAccountWithMetadata } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from "react";












// --- Inline MonadGamesId component ---
const MonadGamesId = () => {
  const { authenticated, user, ready, logout, login } = usePrivy();
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogout = async () => {
    try {
      await logout();
      setAccountAddress("");
      setUsername("");
      setError("");
    } catch (err) {
      setError("Failed to logout");
    }
  };

  const fetchUsername = async (walletAddress: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setUsername(data.hasUsername ? data.user.username : "");
      }
    } catch {
      setError("Failed to load username");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAccountAddress("");
    setUsername("");
    setError("");

    if (authenticated && user && ready && user.linkedAccounts.length > 0) {
      const crossAppAccount = user.linkedAccounts.find(
        acc => acc.type === "cross_app" && acc.providerApp.id === "cmd8euall0037le0my79qpz42"
      ) as CrossAppAccountWithMetadata;

      if (crossAppAccount?.embeddedWallets.length > 0) {
        const walletAddress = crossAppAccount.embeddedWallets[0].address;
        setAccountAddress(walletAddress);
        fetchUsername(walletAddress);
      } else {
        setError("Monad Games ID account not found");
      }
    } else if (authenticated && user && ready) {
      setError("Please link your Monad Games ID account");
    }
  }, [authenticated, user, ready]);

  const truncateAddress = (address: string) => (address ? address.slice(0, 6) + "..." + address.slice(-4) : "");

  if (!ready) return <div>Loading...</div>;

  return (
    <div style={{
      maxWidth: "400px",
      width: "100%",
      margin: "0 auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: "1px solid #ddd",
      textAlign: "center"
    }}>
      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

      {accountAddress ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          {loading ? (
            <p style={{ color: "#555" }}>Loading...</p>
          ) : username ? (
            <div style={{ fontWeight: "bold", color: "#333" }}>User: {username}</div>
          ) : (
            <div>
              <a href="https://monad-games-id-site.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3", textDecoration: "underline" }}>
                Register Username
              </a>
            </div>
          )}

          <div style={{ fontFamily: "monospace", color: "#555" }}>{truncateAddress(accountAddress)}</div>

          <button onClick={handleLogout} style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      ) : (
        !authenticated && (
          <button onClick={login} style={{ background: "#3182ce", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer" }}>
            Login
          </button>
        )
      )}
    </div>
  );
};















// --- Inline dark dungeon game ---
// Game settings
const GRID_SIZE = 32;
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 1200;
const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 200;
const MINIMAP_CELL_SIZE = 3;
const MINIMAP_POSITION = { x: SCREEN_WIDTH - MINIMAP_WIDTH - 10, y: 10 };

// Colors
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const GREEN = '#32FF32';
const YELLOW = '#FFFF32';
const DARK_GRAY = '#323232';
const STONE = '#787878';

// Color palettes
const WALL_PALETTE = [
  '#787878', '#64503C', '#505A64', '#6E645A', '#5A5046', '#826E5A', 
  '#5F554B', '#555F55', '#695F6E', '#737D87', '#7D7369', '#464B50', 
  '#8C8278', '#50463C', '#646E69', '#5A0000', '#821414', '#500A0A', 
  '#64001E', '#3C0014', '#1E0000', '#781E1E', '#8C3232', '#460A28', 
  '#6E0000', '#320A0A', '#5A1E3C', '#643246', '#280505', '#46001E'
];

const FLOOR_PALETTE = [
  '#323232', '#3C3228', '#28323C', '#463C32', '#1E1E28', '#372D23', 
  '#2D3741', '#41372D', '#232832', '#4B4137', '#323C32', '#3C323C', 
  '#28281E', '#50463C', '#2D2319', '#414B55', '#140000', '#280A0A', 
  '#3C1423', '#320014', '#0A000A', '#1E0A0A', '#5A001E', '#140A05', 
  '#230F19', '#32141E', '#190505', '#5A2832'
];

// Base64 sprite placeholders - replace with your actual base64 strings
const PLAYER_IMAGE = "data:image/png;base64,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"
const EXIT_IMAGE = "data:image/png;base64,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"


// Helper function to load base64 images
function loadBase64Image(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

// A single tile on the game map
class Tile {
  x: number;
  y: number;
  type: number; // 0 = wall, 1 = floor, 2 = exit
  explored: boolean;
  visible: boolean;

  constructor(x: number, y: number, tileType: number) {
    this.x = x;
    this.y = y;
    this.type = tileType;
    this.explored = false;
    this.visible = false;
  }
}

// A rectangular room within the dungeon
class Room {
  x: number;
  y: number;
  w: number;
  h: number;
  center: [number, number];

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.center = [x + Math.floor(w / 2), y + Math.floor(h / 2)];
  }

  intersects(other: Room): boolean {
    return (
      this.x < other.x + other.w &&
      this.x + this.w > other.x &&
      this.y < other.y + other.h &&
      this.y + this.h > other.y
    );
  }
}

// Represents any character or object in the game world
class Entity {
  x: number;
  y: number;
  char: string;
  color: string;
  name: string;
  sprite: HTMLImageElement | null;
  can_face_directions: boolean;

  constructor(
    x: number,
    y: number,
    char: string,
    color: string,
    name: string
  ) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
    this.name = name;
    this.sprite = null;
    this.can_face_directions = false;
  }

  async loadSprite() {
    const spriteMapping: Record<string, string> = {
      "Player": PLAYER_IMAGE,
      "Exit": EXIT_IMAGE
    };

    if (spriteMapping[this.name]) {
      try {
        this.sprite = await loadBase64Image(spriteMapping[this.name]);
      } catch (error) {
        console.error(`Failed to load ${this.name} sprite:`, error);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    if (this.sprite) {
      ctx.drawImage(this.sprite, x, y, size, size);
    } else {
      // Fallback to character
      ctx.fillStyle = this.color;
      ctx.font = `${size}px Arial`;
      ctx.fillText(this.char, x + size/4, y + size - size/4);
    }
  }
}

// Represents the player character
class Player extends Entity {
  last_direction: string;
  walletAddress: string;
  username: string;
  lastMoveTime: number = 0;
  moveCooldown: number = 100;

  constructor(x: number, y: number, walletAddress: string, username: string = "") {
    super(x, y, "@", GREEN, "Player");
    this.walletAddress = walletAddress || "";
    this.username = username;
    this.can_face_directions = true;
    this.last_direction = "right";
  }

  canMove(): boolean {
    return Date.now() - this.lastMoveTime > this.moveCooldown;
  }

  recordMove() {
    this.lastMoveTime = Date.now();
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    if (this.sprite) {
      if (this.last_direction === "right") {
        // Flip if facing right
        ctx.save();
        ctx.translate(x + size, y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.sprite, 0, 0, size, size);
        ctx.restore();
      } else {
        // Draw normally if facing left
        ctx.drawImage(this.sprite, x, y, size, size);
      }
    } else {
      // Fallback to character
      ctx.fillStyle = this.color;
      ctx.font = `${size}px Arial`;
      ctx.fillText(this.char, x + size/4, y + size - size/4);
    }
  }
}

// Main game class
class Game {
  map_width: number;
  map_height: number;
  tiles: Tile[][];
  player: Player;
  exit: Entity;
  message: string;
  message_time: number;
  camera_x: number;
  camera_y: number;
  game_state: string;
  dungeon_level: number;
  wall_color: string;
  floor_color: string;

  constructor(playerName: string, walletAddress?: string) {
    this.map_width = 100;
    this.map_height = 100;
    this.tiles = [];
    this.player = new Player(0, 0, walletAddress || playerName);
    this.exit = new Entity(0, 0, "E", YELLOW, "Exit");
    this.message = "";
    this.message_time = 0;
    this.camera_x = 0;
    this.camera_y = 0;
    this.game_state = "playing";
    this.dungeon_level = 1;
    this.wall_color = STONE;
    this.floor_color = DARK_GRAY;
    this.generate_dungeon();
  }

  async initializeSprites() {
    await Promise.all([
      this.player.loadSprite(),
      this.exit.loadSprite()
    ]);
  }

  generate_dungeon() {
    // Choose random colors for this level
    this.wall_color = WALL_PALETTE[Math.floor(Math.random() * WALL_PALETTE.length)];
    this.floor_color = FLOOR_PALETTE[Math.floor(Math.random() * FLOOR_PALETTE.length)];
    
    // Ensure wall and floor colors have enough contrast
    while (this.colorDistance(this.wall_color, this.floor_color) < 60) {
      this.floor_color = FLOOR_PALETTE[Math.floor(Math.random() * FLOOR_PALETTE.length)];
    }
    
    // Reset map to all walls
    this.tiles = Array(this.map_height).fill(0).map((_, y) => 
      Array(this.map_width).fill(0).map((_, x) => new Tile(x, y, 0))
    );
    
    // Generate rooms
    const rooms: Room[] = [];
    const max_rooms = 20 + this.dungeon_level * 2;
    const min_room_size = 8;
    const max_room_size = 20;
    let player_placed = false;
    
    for (let i = 0; i < max_rooms; i++) {
      const w = Math.floor(Math.random() * (max_room_size - min_room_size + 1)) + min_room_size;
      const h = Math.floor(Math.random() * (max_room_size - min_room_size + 1)) + min_room_size;
      const x = Math.floor(Math.random() * (this.map_width - w - 1)) + 1;
      const y = Math.floor(Math.random() * (this.map_height - h - 1)) + 1;
      const new_room = new Room(x, y, w, h);
      
      let failed = false;
      for (const other_room of rooms) {
        if (new_room.intersects(other_room)) {
          failed = true;
          break;
        }
      }
      
      if (!failed) {
        this.carve_room(new_room);
        const [new_x, new_y] = new_room.center;
        
        if (!player_placed) {
          this.player.x = new_x;
          this.player.y = new_y;
          player_placed = true;
        } else {
          const prev_center = rooms[rooms.length - 1].center;
          if (Math.random() < 0.5) {
            this.carve_h_tunnel(prev_center[0], new_x, prev_center[1]);
            this.carve_v_tunnel(prev_center[1], new_y, new_x);
          } else {
            this.carve_v_tunnel(prev_center[1], new_y, prev_center[0]);
            this.carve_h_tunnel(prev_center[0], new_x, new_y);
          }
        }
        
        rooms.push(new_room);
      }
    }
    
    if (!player_placed) {
      this.player.x = 1;
      this.player.y = 1;
      this.tiles[1][1].type = 1;
    }
    
    if (rooms.length > 0) {
      const last_room = rooms[rooms.length - 1];
      this.exit.x = last_room.center[0];
      this.exit.y = last_room.center[1];
      this.tiles[this.exit.y][this.exit.x].type = 2; // Mark as exit tile
    }
    
    this.update_fov();
  }

  colorDistance(color1: string, color2: string): number {
    // Convert hex to RGB
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
  }

  carve_room(room: Room) {
    for (let y = room.y + 1; y < room.y + room.h; y++) {
      for (let x = room.x + 1; x < room.x + room.w; x++) {
        this.tiles[y][x].type = 1;
      }
    }
  }

  carve_h_tunnel(x1: number, x2: number, y: number) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      this.tiles[y][x].type = 1;
    }
  }

  carve_v_tunnel(y1: number, y2: number, x: number) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      this.tiles[y][x].type = 1;
    }
  }

  update_fov() {
    // Reset visibility
    for (let y = 0; y < this.map_height; y++) {
      for (let x = 0; x < this.map_width; x++) {
        this.tiles[y][x].visible = false;
      }
    }
    
    // Mark player's tile as visible
    this.tiles[this.player.y][this.player.x].visible = true;
    this.tiles[this.player.y][this.player.x].explored = true;
    
    // Simple FOV - just show adjacent tiles
    const radius = 6;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = this.player.x + dx;
        const y = this.player.y + dy;
        
        if (x >= 0 && x < this.map_width && y >= 0 && y < this.map_height) {
          if (dx*dx + dy*dy <= radius*radius) {
            this.tiles[y][x].visible = true;
            this.tiles[y][x].explored = true;
          }
        }
      }
    }
  }

  update_camera() {
    this.camera_x = this.player.x * GRID_SIZE - SCREEN_WIDTH / 2;
    this.camera_y = this.player.y * GRID_SIZE - SCREEN_HEIGHT / 2;
    
    const max_x = this.map_width * GRID_SIZE - SCREEN_WIDTH;
    const max_y = this.map_height * GRID_SIZE - SCREEN_HEIGHT;
    this.camera_x = Math.max(0, Math.min(this.camera_x, max_x));
    this.camera_y = Math.max(0, Math.min(this.camera_y, max_y));
  }

  move_player(dx: number, dy: number) {
    if (!this.player.canMove()) return;
    
    const new_x = this.player.x + dx;
    const new_y = this.player.y + dy;
    
    // Update facing direction
    if (dx > 0) {
      this.player.last_direction = "right";
    } else if (dx < 0) {
      this.player.last_direction = "left";
    }
    
    if (new_x < 0 || new_y < 0 || new_x >= this.map_width || new_y >= this.map_height) {
      this.message = "You can't go that way!";
      this.message_time = Date.now();
      return;
    }
    
    if (this.tiles[new_y][new_x].type === 0) {
      this.message = "You can't walk through walls!";
      this.message_time = Date.now();
      return;
    }
    
    // Check if moving to exit
    if (new_x === this.exit.x && new_y === this.exit.y) {
      this.dungeon_level += 1;
      this.message = `Descending to dungeon level ${this.dungeon_level}...`;
      this.message_time = Date.now();
      this.generate_dungeon();
      return;
    }
    
    this.player.x = new_x;
    this.player.y = new_y;
    this.player.recordMove();
    this.update_fov();
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Clear screen
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Calculate visible area
    const start_x = Math.max(0, Math.floor(this.camera_x / GRID_SIZE));
    const start_y = Math.max(0, Math.floor(this.camera_y / GRID_SIZE));
    const end_x = Math.min(this.map_width, Math.ceil((this.camera_x + SCREEN_WIDTH) / GRID_SIZE) + 1);
    const end_y = Math.min(this.map_height, Math.ceil((this.camera_y + SCREEN_HEIGHT) / GRID_SIZE) + 1);
    
    // Draw map
    for (let y = start_y; y < end_y; y++) {
      for (let x = start_x; x < end_x; x++) {
        const screen_x = x * GRID_SIZE - this.camera_x;
        const screen_y = y * GRID_SIZE - this.camera_y;
        const tile = this.tiles[y][x];
        
        if (tile.visible) {
          if (tile.type === 0) { // Wall
            ctx.fillStyle = this.wall_color;
            ctx.fillRect(screen_x, screen_y, GRID_SIZE, GRID_SIZE);
          } else if (tile.type === 1) { // Floor
            ctx.fillStyle = this.floor_color;
            ctx.fillRect(screen_x, screen_y, GRID_SIZE, GRID_SIZE);
          } else if (tile.type === 2) { // Exit
            ctx.fillStyle = this.floor_color;
            ctx.fillRect(screen_x, screen_y, GRID_SIZE, GRID_SIZE);
          }
        } else if (tile.explored) {
          if (tile.type === 0) { // Wall
            ctx.fillStyle = this.darkenColor(this.wall_color);
            ctx.fillRect(screen_x, screen_y, GRID_SIZE, GRID_SIZE);
          } else if (tile.type === 1 || tile.type === 2) { // Floor or Exit
            ctx.fillStyle = this.darkenColor(this.floor_color);
            ctx.fillRect(screen_x, screen_y, GRID_SIZE, GRID_SIZE);
          }
        }
      }
    }
    
    // Draw exit if visible
    if (this.tiles[this.exit.y][this.exit.x].visible) {
      const exit_x = this.exit.x * GRID_SIZE - this.camera_x;
      const exit_y = this.exit.y * GRID_SIZE - this.camera_y;
      this.exit.draw(ctx, exit_x, exit_y, GRID_SIZE);
    }
    
    // Draw player
    const player_x = this.player.x * GRID_SIZE - this.camera_x;
    const player_y = this.player.y * GRID_SIZE - this.camera_y;
    this.player.draw(ctx, player_x, player_y, GRID_SIZE);
    
    // Draw UI
    this.draw_ui(ctx);
    
    // Draw message
    if (Date.now() - this.message_time < 3000) {
      ctx.fillStyle = WHITE;
      ctx.font = "20px Arial";
      ctx.fillText(this.message, 10, SCREEN_HEIGHT - 40);
    }
    
    // Draw minimap
    this.draw_minimap(ctx);
  }

  darkenColor(color: string): string {
    // Simple function to darken a hex color
    const num = parseInt(color.substring(1), 16);
    const r = Math.floor((num >> 16) / 2);
    const g = Math.floor(((num >> 8) & 0x00FF) / 2);
    const b = Math.floor((num & 0x0000FF) / 2);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }


  draw_ui(ctx: CanvasRenderingContext2D) {
    // Draw semi-transparent UI panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, SCREEN_HEIGHT - 80, SCREEN_WIDTH, 80);
  
    // Player info - show username if available, otherwise show wallet address
    ctx.fillStyle = WHITE;
    ctx.font = "16px Arial";
    
    
    ctx.fillText(`Level: ${this.dungeon_level}`, 20, SCREEN_HEIGHT - 75);
    
    // Controls
    ctx.fillText("WASD: Move", SCREEN_WIDTH - 200, SCREEN_HEIGHT - 20);
  }

  draw_minimap(ctx: CanvasRenderingContext2D) {
    // Create minimap
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(MINIMAP_POSITION.x, MINIMAP_POSITION.y, MINIMAP_WIDTH, MINIMAP_HEIGHT);
    
    // Calculate visible area on minimap
    const start_x = Math.max(0, this.player.x - Math.floor(MINIMAP_WIDTH / (2 * MINIMAP_CELL_SIZE)));
    const start_y = Math.max(0, this.player.y - Math.floor(MINIMAP_HEIGHT / (2 * MINIMAP_CELL_SIZE)));
    const end_x = Math.min(this.map_width, start_x + Math.floor(MINIMAP_WIDTH / MINIMAP_CELL_SIZE));
    const end_y = Math.min(this.map_height, start_y + Math.floor(MINIMAP_HEIGHT / MINIMAP_CELL_SIZE));
    
    // Draw explored tiles
    for (let y = start_y; y < end_y; y++) {
      for (let x = start_x; x < end_x; x++) {
        if (this.tiles[y][x].explored) {
          const map_x = MINIMAP_POSITION.x + (x - start_x) * MINIMAP_CELL_SIZE;
          const map_y = MINIMAP_POSITION.y + (y - start_y) * MINIMAP_CELL_SIZE;
          
          let color;
          if (this.tiles[y][x].type === 0) color = this.wall_color;
          else if (this.tiles[y][x].type === 2) color = YELLOW; // Exit
          else color = this.floor_color;
          
          if (!this.tiles[y][x].visible) {
            color = this.darkenColor(color);
          }
          
          ctx.fillStyle = color;
          ctx.fillRect(map_x, map_y, MINIMAP_CELL_SIZE, MINIMAP_CELL_SIZE);
        }
      }
    }
    
    // Draw player position
    const player_map_x = MINIMAP_POSITION.x + (this.player.x - start_x) * MINIMAP_CELL_SIZE;
    const player_map_y = MINIMAP_POSITION.y + (this.player.y - start_y) * MINIMAP_CELL_SIZE;
    ctx.fillStyle = GREEN;
    ctx.fillRect(player_map_x, player_map_y, MINIMAP_CELL_SIZE, MINIMAP_CELL_SIZE);
    
    // Draw border
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = 1;
    ctx.strokeRect(MINIMAP_POSITION.x, MINIMAP_POSITION.y, MINIMAP_WIDTH, MINIMAP_HEIGHT);
  }
}














// React component for the game

function DungeonCrawler({ username }: { username: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { authenticated, user, ready } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const gameRef = useRef<Game | null>(null);
  const animationRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const crossAppAccount = user.linkedAccounts.find(
      account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
    ) as CrossAppAccountWithMetadata;

    if (crossAppAccount?.embeddedWallets.length > 0) {
      const address = crossAppAccount.embeddedWallets[0].address;
      setWalletAddress(address);
    }
  }, [ready, authenticated, user]);

  useEffect(() => {
    if (!walletAddress) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize game with wallet address and username
    gameRef.current = new Game("Player", walletAddress);
    const game = gameRef.current;

    // Initialize sprites
    game.initializeSprites().then(() => {
      // Key handlers
      const handleKeyDown = (e: KeyboardEvent) => {
        keysRef.current.add(e.key.toLowerCase());
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keysRef.current.delete(e.key.toLowerCase());
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Game loop
      const gameLoop = () => {
        const game = gameRef.current;
        if (!game) return;

        const keys = keysRef.current;
        let dx = 0, dy = 0;

        if (keys.has('w') || keys.has('arrowup')) dy = -1;
        if (keys.has('s') || keys.has('arrowdown')) dy = 1;
        if (keys.has('a') || keys.has('arrowleft')) dx = -1;
        if (keys.has('d') || keys.has('arrowright')) dx = 1;

        if (dx !== 0 || dy !== 0) {
          game.move_player(dx, dy);
        }

        game.update_camera();
        game.draw(ctx);

        animationRef.current = requestAnimationFrame(gameLoop);
      };

      animationRef.current = requestAnimationFrame(gameLoop);

      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    });

    return () => {
      // Clean up game resources when component unmounts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gameRef.current = null;
    };
  }, [walletAddress, username]);

  if (!walletAddress) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        className="border border-gray-800"
      />
    </div>
  );
}



















// Updated App component
function App() {
  const { authenticated, ready } = usePrivy();
  const [username] = useState("");

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: "30px", 
      minHeight: "100vh", 
      padding: "20px", 
      background: "#f9f9f9" 
    }}>
      <MonadGamesId />
      {authenticated && <DungeonCrawler username={username} />}
    </div>
  );
}

export default App;











