import Axios from 'axios';
import Card from './card/card';
import { ICardInterface } from './card/card-interface';
import styled from './styled/styled-components-main';
import * as React from 'react';
// import { log } from 'util';

const MainView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  height: 100%;
  width: 100%;
  background-color: #000;
`;

const LoadingView = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
  background: #000;   
  height: 100%;
  width: 100%;
  text-align: center;  
`;

const LoadingSpan = styled.span`
  margin: 0 0 1em 0;
  text-align: center;
  display: flex;
  align-self: center;
  color: #fff;
  font-weight: bold;
`

const Title = styled.div`
  display: flex;
  width: 100%;
  margin-top: -45px;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`

const StyledImageTitle = styled.img`
  width: 300px;
  height: auto;
`

const Cards = styled.div`
  margin: -85px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  background-color: #000;
`

const Hourglass = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;

  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 6px;
    box-sizing: border-box;
    border: 26px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-hourglass 1.2s infinite;
  }
`;

interface IState { 
  cards: ICardInterface[], 
  card1: ICardInterface, 
  card2: ICardInterface, 
  card3: ICardInterface, 
  card4: ICardInterface, 
  card5: ICardInterface, 
  card6: ICardInterface, 
  canShow: boolean,
  cardsDuplicated: ICardInterface[] 
};

class App extends React.Component<{}, IState> {
  public state = {
    cards: [],
    canShow: false,
    card1: { imageUrl: '', id: 0, isTurned: false, onTurn:() => ({}) },
    card2: { imageUrl: '', id: 1, isTurned: false, onTurn:() => ({}) },
    card3: { imageUrl: '', id: 2, isTurned: false, onTurn:() => ({}) },
    card4: { imageUrl: '', id: 3, isTurned: false, onTurn:() => ({}) },
    card5: { imageUrl: '', id: 4, isTurned: false, onTurn:() => ({}) },
    card6: { imageUrl: '', id: 5, isTurned: false, onTurn:() => ({}) },
    cardsDuplicated: []
  }

  constructor(props: any) {
    super(props);
    this.getCards();  
  }

  public render() {
    const { cards, canShow } = this.state;

    if (!canShow) {
      return  (
        <LoadingView>
          <LoadingSpan>Loading cards...</LoadingSpan>
          <Hourglass/>
        </LoadingView>
      );
    }

    return (
      <MainView> 
        <Title>
          <StyledImageTitle src={require('./logo.jpg')} alt="img-title"/>
        </Title>
        <Cards>
          {cards.map((card: ICardInterface, index: number) => (
            <Card key={index} id={index} isTurned={card.isTurned} imageUrl={card.imageUrl} onTurn={this.handleTurn} />)
          )}
        </Cards>
      </MainView>
    );
  }

  private shuffle = (array: any) => {
    let temporaryValue: number;
    let randomIndex: number;
    const returnedArray = [...array];

    array.forEach((it: any, currentIndex: number) => {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      returnedArray[currentIndex] = returnedArray[randomIndex];
      returnedArray[randomIndex] = temporaryValue;
    })

    return returnedArray;
  }

  private getCards = async () => {
    const ids = [447242, 442889, 447139, 435212, 447290, 447355];


    await Promise.all(ids.map(async (id) => {
      const { data } = await Axios.get(`https://api.magicthegathering.io/v1/cards/${id}`);      
      this.setState({ cardsDuplicated: [...this.state.cardsDuplicated, data.card] });

      return data;
    }))

    const { cardsDuplicated } = this.state;
    const otherDuplicate = cardsDuplicated.slice(0);
    const shuffledCards = this.shuffle([...cardsDuplicated, ...otherDuplicate]);

    this.setState({ canShow: true, cards: [...shuffledCards] });
  }

  private handleTurn = (id: number) => {
    console.log('====================================');
    console.log(id, ':id');
    console.log('====================================');
    const { cards } = this.state;    
    const newCards = cards.map((card: ICardInterface, index: number) => {
      if (index === id) {
        console.log('====================================');
        console.log(card);
        console.log('====================================');
        card.isTurned = !card.isTurned;
      }

      return card;
    });

    this.setState({ cards: newCards });
  }
}

export default App;
