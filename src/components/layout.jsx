import * as React from 'react';
import { useStaticQuery, graphql, navigate } from "gatsby"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowRight from '@mui/icons-material/ArrowRight'

import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import theme from "../theme"

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    padding: "0 1em",
    margin: "0 auto",
    width: "650px",
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({children, location}) {
  const data = useStaticQuery(graphql`
    query siteinfo {
      site {
        siteMetadata {
          title
          author
          description
        }
      }
      allFile(filter: {extension: {eq: "html"}}, sort: {fields: name, order: ASC}) {
        nodes {
          name
        }
      }
    }
  `)
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const pages = data.allFile.nodes.filter((item) => item.name !== 'home')
  pages.unshift({name: 'home'})

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {data.site.siteMetadata.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              // width: drawerWidth,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <Typography paragraph variant="caption" sx={{padding: theme.spacing(3)}}>
              {data.site.siteMetadata.description}
              <br/><em>By: {data.site.siteMetadata.author}</em>
            </Typography>
            <Divider />
            <List dense>
              {pages.map((node) => {
                const title = node.name.charAt(0).toUpperCase() + node.name.slice(1)
                const link = node.name === 'home' ? '' : node.name
                const active = node.name === location
                return (
                  <ListItem disablePadding key={node.name}>
                    <ListItemButton>
                      <ListItemIcon sx={{paddingBottom: '1rem'}}><ArrowRight/></ListItemIcon>
                      <ListItemText
                        primary={title} onClick={() => navigate(`/${link}`)} sx={{
                          ...(active && {color: theme.palette.primary.main})
                        }} />
                    </ListItemButton>
                  </ListItem>)
              })}
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{paddingBottom: '1rem'}}>
                    <ArrowRight/>
                  </ListItemIcon>
                    <ListItemText primary="Annotate me"
                    onClick={() => {
                      const hypothesis = document.createElement('script')
                      hypothesis.setAttribute('src','https://hypothes.is/embed.js')
                      document.head.appendChild(hypothesis)}
                    }/>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <Typography paragraph sx={{padding: theme.spacing(3)}} variant="caption">
              Built with <a href="https://github.com/raffazizzi/gatsby-theme-ceteicean" target="_blank">Gatsby Theme Ceteicean</a>.
              Distributed under an MIT license. Other content on
              this site is released under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
            </Typography>
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            {children}
          </Main>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}