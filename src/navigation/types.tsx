

export type RootStackParamList = {
  Splash: undefined; 
  Login: undefined; 
  Register: undefined;
  MainApp: undefined;
};

export type MainTabParamList = {
  HomeStack: undefined; 
  Favorites: undefined;
  Profile: undefined;
  CustomerSupport: undefined;
};
export interface CardItem {
  id: number;
  title: string;
  subtitle: string;
  ratings: number;
  imageUrl: string;
  type: string;
  cost: string;
  category: string;
}
