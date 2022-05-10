import { Outlet, NavLink } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from '@mui/icons-material/Search';

export default function App() {
  return (
    <div>
      <NavItems>
        <BrandTitle className="mx-4">MOVEMENT</BrandTitle>
        <div>
          <SearchBar placeholder="Search..."/>
          <StyledSearchIcon />
        </div>
        <div>
          <NavLink to="/home">
            <li>Home</li>
          </NavLink> |
          <NavLink to="/library">
            <li>Library</li>
          </NavLink> |
          <NavLink to="/create">
            <li>Create</li>
          </NavLink> |{" "}
          <NavLink to="/skeleton">
            <li>Skeleton</li>
          </NavLink> |
          <NavLink to="/upload">
            <li>Upload</li>
          </NavLink> |
        </div>
        <LoginButton>Login</LoginButton>
      </NavItems>
      <Outlet />
    </div>
  );
}

const SearchBar = styled.input`
  display: inline;
  border-radius: 5px;
  margin-bottom: 5px;
`
const StyledSearchIcon = styled(SearchIcon)`
  color: #FFFFFF;
  margin-left: 5px;
`

const LoginButton = styled.button`
  background-color: green;
  margin: 0 5px 5px ;
  display: flex;
  border-radius: 5px;  
`

const NavItems = styled.ul`

  justify-content: space-between;

  display: flex;

  background-color: #212529;
  
  text-align: center;

  padding-top: .5rem;
  a {
    text-decoration: none;
  }

  li {
    color: #FFFFFF;
    list-style: none;
    position: relative;
    margin: 0 1rem;
    display: inline;
  }
`

const BrandTitle = styled.h1`
  font-size: 1.5rem;
  color: #3A36E7;
`