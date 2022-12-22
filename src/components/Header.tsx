import styled  from 'styled-components';

const Style = styled.div`
    display: flex;
    flex-direction: column;
    border: 4px solid black;
    padding: 0.5em 2em;
    margin: 1em;
`

export const Header = () => (
    <Style>
        <h1>simple lastfm generator</h1>
        <p>Generate a text output of your top artists and tags to paste anywhere</p>
    </Style>
)