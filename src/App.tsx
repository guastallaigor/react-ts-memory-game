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
  position: absolute;
  top: 0;
`

const Cards = styled.div`
  @media (max-width: 1399px) {
    margin: 12em auto;
  }

  @media (min-width: 1400px) {
    margin: 10em auto 0 auto;
  }
  
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

const Counter = styled.span`
  font-weight: bold;
  color: #fff;
  position: absolute;
  left: 4.3em;
  top: 2em;
  font-size: 2em;
`

const StyledButton = styled.button`
  font-size: 2em;
  position: absolute;
  right: 4.3em;
  top: 1em;
  font-weight: bold;
  color: #fff;
  background-image: linear-gradient(to top, #d4312b 65%, #fd9145);
  width: 180px;
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity .2s ease-out;

  &:hover {
    opacity: .7;
  }
`

interface IState { 
  cards: ICardInterface[], 
  canShow: boolean,
  counter: number,
  cardsDuplicated: ICardInterface[],
  openedCards: ICardInterface[]
};

class App extends React.Component<{}, IState> {
  public state = {
    cards: [],
    canShow: false,
    counter: 0,
    cardsDuplicated: [],
    openedCards: []
  }

  constructor(props: any) {
    super(props);
    this.getCards();  
  }

  public render() {
    const { cards, canShow, counter } = this.state;

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
          <Counter>Matched cards: {counter}</Counter>
          <StyledImageTitle src={require('./logo.jpg')} alt="img-title"/>
          <StyledButton onClick={this.restart}>Restart</StyledButton>
        </Title>
        <Cards>
          {cards.map((card: ICardInterface, index: number) => (
            <Card key={index} id={index} isTurned={card.isTurned} imageUrl={card.imageUrl} onTurn={this.handleTurn} />)
          )}
        </Cards>
      </MainView>
    );
  }

  public componentDidUpdate() {
    const { openedCards, cards, counter } = this.state

    if (openedCards.length === 2) {
      const card1: ICardInterface = openedCards[0];
      const card2: ICardInterface = openedCards[1];
      const incrementCounter: boolean = card1.id === card2.id;
      let newCards: ICardInterface[] = [];

      if (!incrementCounter) {
        setTimeout(() => {
          newCards = cards.map((card: ICardInterface, index: number) => {
            if (card1.id === card.id || card2.id === card.id) {
              card.isTurned = false
            }
    
            return card;
          });
          
          this.setState(() => ({ openedCards: [], cards: newCards }));
        }, 1000)

        return;
      }
      
      this.setState(() => ({ openedCards: [], counter: counter + 1 }));
    }
  }

  private getAllCardsFolded = () => {
    const { cardsDuplicated, cards } = this.state;
    const duplicatedCardsFolded = cardsDuplicated.map((card: ICardInterface) => {
      card.isTurned = false;

      return card;
    });
    const cardsFolded = cards.map((card: ICardInterface) => {
      card.isTurned = false;

      return card;
    });

    this.setState(() => ({ cardsDuplicated: duplicatedCardsFolded, cards: cardsFolded }));
  }

  private restart = () => {
    this.getAllCardsFolded();
    setTimeout(() => {
      this.setState(() => ({ cards: [], counter: 0, canShow: false }));
      this.init();
    }, 400)
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
    const ids: number[] = [447242, 442889, 447139, 435212, 447290, 447355];

    await Promise.all(ids.map(async (id) => {
      const { data } = await Axios.get(`https://api.magicthegathering.io/v1/cards/${id}`);      
      this.setState(() => ({ cardsDuplicated: [...this.state.cardsDuplicated, data.card] }));

      return data;
    }))

    this.init();
  }

  private init = () => {
    const { cardsDuplicated } = this.state;
    const otherDuplicate = cardsDuplicated.map((card: ICardInterface) => ({ ...card}));
    const shuffledCards = this.shuffle([...cardsDuplicated, ...otherDuplicate]);

    this.setState(() => ({ canShow: true, cards: [...shuffledCards] }));
  }

  private handleTurn = (idx: number) => {
    const { cards, openedCards } = this.state;
    if (openedCards.length === 2) {
      return;
    }

    const newCards = cards.map((card: ICardInterface, index: number) => {
      if (index === idx) {
        if (card.isTurned) {
          return card
        }

        card.isTurned = !card.isTurned;
        this.setState(() => ({ openedCards: [...openedCards, card]}));        
      }

      return card;
    });

    this.setState(() => ({ cards: newCards }));
  }
}

export default App;
