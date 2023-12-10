import styled  from 'styled-components';
import './../App.css';

const Style = styled.div`
    display: flex;
    flex-direction: column;
`

export const Header = () => (
    <Style>
        <h1>simple lastfm generator</h1>
        <p>Generate a text output of your top artists and tags to paste anywhere</p>
    </Style>
)
