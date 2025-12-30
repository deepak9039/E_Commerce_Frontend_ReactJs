import React from 'react';
import { Container, Typography } from '@mui/material';
import { findAllCategory } from '../../services/apiService';

const CategorySidebar = () => {
    const [categories, setCategories] = React.useState([]);
    const fetchCategories = async () => {
        try {
            const response = await findAllCategory();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    React.useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <Container sx={{ pb: 4 }}>
            <Typography variant="h6">Categories</Typography>
            {categories.length === 0 ? (
                <Typography variant="body2">No categories available.</Typography>
            ) : null}
            {categories.map((category, i) => {
                return (
                    <Typography key={category.categoryId} variant="body1" sx={{ mt: 1, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>
                        {category.categoryName}
                        {/* <img
                        src={`http://localhost:1234/image/category/${category.categoryImage}`}
                        alt={category.categoryName}
                        style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }}
                        /> */}
                    </Typography>
                );
            })}
        </Container>
    );
};

export default CategorySidebar;
