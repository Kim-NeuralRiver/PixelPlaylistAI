export interface Config {
    app: {
        mailgen: {
            theme: 'default' | 'salted' | 'neopolitan';  // Catch errors / incorrect themes before problem
            product: {
                name: string;
                link: string;
            };
        };
    };
};
