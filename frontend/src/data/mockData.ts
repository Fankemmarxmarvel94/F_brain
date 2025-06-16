import type { Manga, User, Review } from '../types';

export const mockMangas: Manga[] = [
  {
    id: '1',
    title: 'One Piece',
    titleJapanese: 'ワンピース',
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    genres: ['Action', 'Aventure', 'Comédie', 'Drame', 'Shōnen'],
    status: 'En cours',
    volumes: 107,
    chapters: 1100,
    year: 1997,
    synopsis: 'Monkey D. Luffy rêve de devenir le roi des pirates. Il commence son voyage depuis son village natal vers Grand Line pour trouver le légendaire trésor One Piece.',
    coverImage: 'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    totalRatings: 15420,
    demographics: 'Shōnen',
    publisher: 'Shueisha',
    serialization: 'Weekly Shōnen Jump'
  },
  {
    id: '2',
    title: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    author: 'Hajime Isayama',
    artist: 'Hajime Isayama',
    genres: ['Action', 'Drame', 'Fantasy', 'Horreur', 'Militaire', 'Tragédie'],
    status: 'Terminé',
    volumes: 34,
    chapters: 139,
    year: 2009,
    synopsis: 'Depuis un siècle, les humains vivent derrière des murailles pour se protéger des Titans, des géants mangeurs d\'hommes. Eren Yeager rejoint les forces militaires pour venger sa mère.',
    coverImage: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    totalRatings: 12850,
    demographics: 'Shōnen',
    publisher: 'Kodansha',
    serialization: 'Bessatsu Shōnen Magazine'
  },
  {
    id: '3',
    title: 'Your Name',
    titleJapanese: '君の名は',
    author: 'Makoto Shinkai',
    artist: 'Ranmaru Kotone',
    genres: ['Romance', 'Drame', 'Surnaturel', 'École'],
    status: 'Terminé',
    volumes: 3,
    chapters: 9,
    year: 2016,
    synopsis: 'Mitsuha et Taki, deux lycéens qui ne se connaissent pas, commencent mystérieusement à échanger leurs corps. Une histoire d\'amour touchante à travers le temps et l\'espace.',
    coverImage: 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    totalRatings: 8930,
    demographics: 'Shōnen',
    publisher: 'Kadokawa',
    serialization: 'Monthly Comic Ryu'
  },
  {
    id: '4',
    title: 'Demon Slayer',
    titleJapanese: '鬼滅の刃',
    author: 'Koyoharu Gotouge',
    artist: 'Koyoharu Gotouge',
    genres: ['Action', 'Historique', 'Surnaturel', 'Shōnen'],
    status: 'Terminé',
    volumes: 23,
    chapters: 205,
    year: 2016,
    synopsis: 'Tanjiro Kamado devient un chasseur de démons pour sauver sa sœur transformée en démon et venger sa famille massacrée.',
    coverImage: 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    totalRatings: 11200,
    demographics: 'Shōnen',
    publisher: 'Shueisha',
    serialization: 'Weekly Shōnen Jump'
  },
  {
    id: '5',
    title: 'Spirited Away',
    titleJapanese: '千と千尋の神隠し',
    author: 'Hayao Miyazaki',
    artist: 'Miyuki Miyabe',
    genres: ['Aventure', 'Famille', 'Surnaturel', 'Fantasy'],
    status: 'Terminé',
    volumes: 5,
    chapters: 20,
    year: 2001,
    synopsis: 'Chihiro, une petite fille de 10 ans, se retrouve piégée dans un monde peuplé d\'esprits et doit travailler dans un bain public pour les dieux afin de sauver ses parents.',
    coverImage: 'https://images.pexels.com/photos/1820819/pexels-photo-1820819.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    totalRatings: 9650,
    demographics: 'Kodomo',
    publisher: 'Tokuma Shoten',
    serialization: 'Animage'
  },
  {
    id: '6',
    title: 'Death Note',
    titleJapanese: 'デスノート',
    author: 'Tsugumi Ohba',
    artist: 'Takeshi Obata',
    genres: ['Thriller', 'Surnaturel', 'Psychologique', 'Drame'],
    status: 'Terminé',
    volumes: 12,
    chapters: 108,
    year: 2003,
    synopsis: 'Light Yagami, un lycéen brillant, trouve un carnet de la mort qui lui permet de tuer quiconque en écrivant son nom. Un jeu du chat et de la souris commence avec le détective L.',
    coverImage: 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    totalRatings: 13500,
    demographics: 'Shōnen',
    publisher: 'Shueisha',
    serialization: 'Weekly Shōnen Jump'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'MangaFan2024',
    email: 'mangafan@email.com',
    favorites: ['1', '2', '5'],
    readingList: ['3', '4', '6'],
    joinedDate: new Date('2024-01-15')
  },
  {
    id: '2',
    username: 'OtakuMaster',
    email: 'otaku@email.com',
    favorites: ['2', '4', '6'],
    readingList: ['1', '3', '5'],
    joinedDate: new Date('2023-11-20')
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    mangaId: '1',
    userId: '1',
    username: 'MangaFan2024',
    rating: 5,
    comment: 'Un chef-d\'œuvre absolu ! L\'histoire de Luffy et son équipage est captivante depuis le début. Les personnages sont attachants et l\'univers est incroyablement riche.',
    date: new Date('2024-01-02'),
    helpful: 45
  },
  {
    id: '2',
    mangaId: '1',
    userId: '2',
    username: 'OtakuMaster',
    rating: 5,
    comment: 'Plus de 1000 chapitres et toujours aussi bon ! Oda est un génie du storytelling. Chaque arc apporte quelque chose de nouveau.',
    date: new Date('2024-01-05'),
    helpful: 32
  },
  {
    id: '3',
    mangaId: '2',
    userId: '1',
    username: 'MangaFan2024',
    rating: 5,
    comment: 'Attack on Titan redéfinit ce qu\'un manga peut être. L\'intrigue est complexe et les révélations sont époustouflantes. Un must-read !',
    date: new Date('2024-01-10'),
    helpful: 28
  },
  {
    id: '4',
    mangaId: '3',
    userId: '2',
    username: 'OtakuMaster',
    rating: 4,
    comment: 'Adaptation manga fidèle au film. L\'émotion est bien retranscrite même si c\'est plus court que le film original.',
    date: new Date('2024-01-12'),
    helpful: 18
  }
];

export const genresList = [
  'Action', 'Aventure', 'Comédie', 'Drame', 'Fantasy', 'Horreur', 'Romance', 
  'Science-Fiction', 'Slice of Life', 'Sport', 'Thriller', 'Mystère', 
  'Historique', 'Militaire', 'École', 'Mecha', 'Yaoi', 'Yuri', 'Ecchi', 'Harem'
];

export const demographicsList = ['Shōnen', 'Shōjo', 'Seinen', 'Josei', 'Kodomo'];

export const statusList = ['En cours', 'Terminé', 'Hiatus', 'Annulé'];