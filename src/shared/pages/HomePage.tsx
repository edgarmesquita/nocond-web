import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import axios from 'axios';
import { RouteComponentProps } from "react-router-dom";
import { AppBreadcrumbs, AppLayout } from "../components";
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@material-ui/core";
import cover from "../../assets/images/cover.jpg";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        cover: {
            backgroundImage: `url(${cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            minHeight: '220px',
            marginTop: - theme.spacing(3),
            marginLeft: - theme.spacing(3),
            marginRight: - theme.spacing(3),
            marginBottom: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
                minHeight: '260px',
            },
            [theme.breakpoints.up('lg')]: {
                minHeight: '300px',
            },
        }
    });

interface GoogleArticle {
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}
interface GoogleNews {
    articles: GoogleArticle[];
}

type HomePageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const HomePage = ({ classes, ...props }: HomePageProps) => {
    const url = "http://newsapi.org/v2/top-headlines?sources=google-news-br&apiKey=a050b56e089d4dd9be0dae0b5c3a1810";
    const [response, setResponse] = React.useState<GoogleNews | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    React.useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const res = await axios(url);
                setResponse(res.data);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, [url]);
    return (
        <AppLayout {...props}>
            <Box className={classes.cover}></Box>
            <AppBreadcrumbs items={[{ name: 'Home', path: '/', icon: 'home' }]} {...props} />

            <Typography variant="h5" component="h2" gutterBottom>Últimas Notícias</Typography>
            <Grid container spacing={2}>
                {response?.articles.map((news: GoogleArticle, idx) => (
                    <Grid item key={idx} sm={6} md={4}>
                        <Card>
                            <CardActionArea href={news.url} target="_blank">
                                <CardMedia
                                    component="img"
                                    alt={news.title}
                                    height="140"
                                    image={news.urlToImage}
                                    title={news.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="h3">
                                        {news.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {news.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AppLayout>
    );
}

export default withStyles(styles)(HomePage);