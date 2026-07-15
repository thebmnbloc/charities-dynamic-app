const pool = require('./connection');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['admin', 'admin@charitics.com', hashedPassword]
    );
    console.log('Admin user created (admin / admin123)');

    // Seed team members
    const teamMembers = [
      { name: 'Danial Frankie', role: 'Co-Founder', image: 'assets/img/member-1.jpg', bio: 'Adipiscing elit. Mauris viverra nisl quis mollis laoreet. Ut eget lacus a felis accumsan pharetra in dignissim enim.', phone: '+208-555-0112', email: 'thomas.tatum@example.com', facebook: '#', twitter: '#', linkedin: '#', instagram: '#', experience: JSON.stringify([{name:'Productivity',value:90},{name:'Digital Marketing',value:87},{name:'Technology',value:65}]) },
      { name: 'John Doe', role: 'Attorney', image: 'assets/img/member-2.jpg', bio: 'Professional attorney with 10+ years of experience in non-profit law.', phone: '+208-555-0113', email: 'john.doe@example.com', facebook: '#', twitter: '#', linkedin: '#', instagram: '#', experience: JSON.stringify([{name:'Legal',value:95},{name:'Management',value:80},{name:'Strategy',value:75}]) },
      { name: 'Sarah Wilson', role: 'Project Director', image: 'assets/img/member-3.jpg', bio: 'Leading our global initiatives with passion and dedication.', phone: '+208-555-0114', email: 'sarah.w@example.com', facebook: '#', twitter: '#', linkedin: '#', instagram: '#', experience: JSON.stringify([{name:'Leadership',value:92},{name:'Planning',value:88},{name:'Communication',value:85}]) },
      { name: 'Mike Johnson', role: 'Volunteer Lead', image: 'assets/img/member-4.jpg', bio: 'Coordinating our volunteer network across 20+ countries.', phone: '+208-555-0115', email: 'mike.j@example.com', facebook: '#', twitter: '#', linkedin: '#', instagram: '#', experience: JSON.stringify([{name:'Coordination',value:90},{name:'Team Building',value:85},{name:'Fundraising',value:80}]) },
    ];
    for (const member of teamMembers) {
      await pool.query(
        `INSERT INTO team (name, role, image, bio, phone, email, facebook, twitter, linkedin, instagram, experience)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [member.name, member.role, member.image, member.bio, member.phone, member.email, member.facebook, member.twitter, member.linkedin, member.instagram, member.experience]
      );
    }
    console.log('Team members seeded');

    // Seed services
    const services = [
      { title: 'Fund Raised & Donation', description: 'Professional Detailed Residential Cleaning, Ensuring Spotless Homes And Healthy Living Spaces.', image: 'assets/img/service-1.jpg', details: 'We raise funds through various channels to support communities in need.' },
      { title: 'Medical Treatment Help', description: 'Professional Detailed Residential Cleaning, Ensuring Spotless Homes And Healthy Living Spaces.', image: 'assets/img/service-2.jpg', details: 'Providing access to quality healthcare for underserved communities.' },
      { title: 'Child Medical Research', description: 'Professional Detailed Residential Cleaning, Ensuring Spotless Homes And Healthy Living Spaces.', image: 'assets/img/service-3.jpg', details: 'Investing in research to improve child healthcare outcomes worldwide.' },
      { title: 'Development Programs', description: 'Professional Detailed Residential Cleaning, Ensuring Spotless Homes And Healthy Living Spaces.', image: 'assets/img/service-4.jpg', details: 'Comprehensive development programs for sustainable community growth.' },
    ];
    for (const service of services) {
      await pool.query(
        'INSERT INTO services (title, description, image, details) VALUES ($1,$2,$3,$4)',
        [service.title, service.description, service.image, service.details]
      );
    }
    console.log('Services seeded');

    // Seed projects
    const projects = [
      { title: 'Child trouble & care', description: 'Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget potenti vestibulum.', image: 'assets/img/project-1.jpg', category: 'Demostic & Transportation', author: 'Athena Jones', tags: 'Data Masters', cost: 'USD 1,50,499' },
      { title: 'Child trouble & care', description: 'Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget potenti vestibulum.', image: 'assets/img/project-2.jpg', category: 'Demostic & Transportation', author: 'Athena Jones', tags: 'Data Masters', cost: 'USD 2,50,000' },
      { title: 'Child trouble & care', description: 'Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget potenti vestibulum.', image: 'assets/img/project-3.jpg', category: 'Demostic & Transportation', author: 'Athena Jones', tags: 'Data Masters', cost: 'USD 3,50,000' },
      { title: 'Child trouble & care', description: 'Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget potenti vestibulum.', image: 'assets/img/project-4.jpg', category: 'Demostic & Transportation', author: 'Athena Jones', tags: 'Data Masters', cost: 'USD 4,50,000' },
    ];
    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (title, description, image, category, author, tags, cost)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [project.title, project.description, project.image, project.category, project.author, project.tags, project.cost]
      );
    }
    console.log('Projects seeded');

    // Seed donations
    const donations = [
      { title: 'Life Skills for Children in South African peoples', description: 'We work together to make a lasting difference, helping people. With kindness and hard work.', image: 'assets/img/donation-1.jpg', tag: 'Foods', raised: 25000, goal: 30000, summary: 'This campaign aims to provide life skills training for children in South Africa.' },
      { title: 'Life Skills for Children in South African peoples', description: 'We work together to make a lasting difference, helping people. With kindness and hard work.', image: 'assets/img/donation-2.jpg', tag: 'Foods', raised: 28500, goal: 30000, summary: 'Providing essential education and skills for a better future.' },
      { title: 'Life Skills for Children in South African peoples', description: 'We work together to make a lasting difference, helping people. With kindness and hard work.', image: 'assets/img/donation-3.jpg', tag: 'Foods', raised: 15000, goal: 30000, summary: 'Building brighter futures through education and support.' },
      { title: 'Life Skills for Children in South African peoples', description: 'We work together to make a lasting difference, helping people. With kindness and hard work.', image: 'assets/img/donation-4.jpg', tag: 'Foods', raised: 19200, goal: 30000, summary: 'Empowering children with the skills they need to succeed.' },
    ];
    for (const donation of donations) {
      await pool.query(
        `INSERT INTO donations (title, description, image, tag, raised, goal, summary)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [donation.title, donation.description, donation.image, donation.tag, donation.raised, donation.goal, donation.summary]
      );
    }
    console.log('Donations seeded');

    // Seed events
    const events = [
      { title: 'Manager Disapproved of the Most Recent Work.', description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernaturaut.', image: 'assets/img/event-img.jpg', event_date: '2026-07-29', venue: '350 5th Ave New York, NY 118 United States', mission: 'Our mission is to create lasting impact through community engagement.' },
      { title: 'Annual Charity Gala for Children Education', description: 'Join us for our annual gala supporting children education worldwide.', image: 'assets/img/blog-b-1.jpg', event_date: '2026-08-15', venue: 'Grand Hotel, Philadelphia PA', mission: 'Raising awareness and funds for educational programs.' },
    ];
    for (const event of events) {
      await pool.query(
        `INSERT INTO events (title, description, image, event_date, venue, mission)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [event.title, event.description, event.image, event.event_date, event.venue, event.mission]
      );
    }
    console.log('Events seeded');

    // Seed blogs
    const blogs = [
      { title: 'Give Education, It\'s The Best Gift Ever.', excerpt: 'When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template.', content: '<p>When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template fo looking bare or minimizing the distractions of the draft copy.</p><p>One of the most remarkable applications of AI in healthcare is in diagnostics.</p>', image: 'assets/img/blog-1.jpg', author: 'Admin', category: 'Donation', tags: 'Reseller, Hosting' },
      { title: 'Don\'t treat oceans as universal garbage cans', excerpt: 'When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template.', content: '<p>When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template fo looking bare or minimizing the distractions of the draft copy.</p>', image: 'assets/img/blog-2.jpg', author: 'Admin', category: 'Donation', tags: 'WP Hosting' },
      { title: 'The sun and the sand makes beaches beautiful', excerpt: 'When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template.', content: '<p>When to Use Lorem Ipsum generally, lorem ipsum is best suited to keeping template fo looking bare or minimizing the distractions of the draft copy.</p>', image: 'assets/img/blog-3.jpg', author: 'Admin', category: 'Donation', tags: 'Hosting' },
    ];
    for (const blog of blogs) {
      await pool.query(
        `INSERT INTO blogs (title, excerpt, content, image, author, category, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [blog.title, blog.excerpt, blog.content, blog.image, blog.author, blog.category, blog.tags]
      );
    }
    console.log('Blogs seeded');

    // Seed pricing
    const pricing = [
      { name: 'Basic', price: 19, duration: 'Month', description: 'We care about their success. For us real relationship.', features: JSON.stringify(['Providing solutions', 'Service that matters', 'Giving our best', '24/7 Skilled Support', 'We serve differently']) },
      { name: 'Standard', price: 59, duration: 'Month', description: 'We care about their success. For us real relationship.', features: JSON.stringify(['Providing solutions', 'Service that matters', 'Giving our best', '24/7 Skilled Support', 'We serve differently']) },
      { name: 'Premium', price: 110, duration: 'Month', description: 'We care about their success. For us real relationship.', features: JSON.stringify(['Providing solutions', 'Service that matters', 'Giving our best', '24/7 Skilled Support', 'We serve differently']) },
    ];
    for (const plan of pricing) {
      await pool.query(
        'INSERT INTO pricing (name, price, duration, description, features) VALUES ($1,$2,$3,$4,$5)',
        [plan.name, plan.price, plan.duration, plan.description, plan.features]
      );
    }
    console.log('Pricing seeded');

    // Seed FAQs
    const faqs = [
      { question: 'Recognition and Fulfillment', answer: 'Aonsectetur adipiscing elit Aenean scelerisque augue vitae consequat Juisque eget congue velit in cursus leo sodales the turpis euismod quis sapien euismod quis sapien the. E-learning is suitable for students, professionals, and anyone interested.' },
      { question: 'Why Join Us as a Volunteer?', answer: 'Aonsectetur adipiscing elit Aenean scelerisque augue vitae consequat Juisque eget congue velit in cursus leo sodales the turpis euismod quis sapien euismod quis sapien the. E-learning is suitable for students, professionals, and anyone interested.' },
      { question: 'Be Part of a Community', answer: 'Aonsectetur adipiscing elit Aenean scelerisque augue vitae consequat Juisque eget congue velit in cursus leo sodales the turpis euismod quis sapien euismod quis sapien the. E-learning is suitable for students, professionals, and anyone interested.' },
    ];
    for (const faq of faqs) {
      await pool.query('INSERT INTO faqs (question, answer) VALUES ($1,$2)', [faq.question, faq.answer]);
    }
    console.log('FAQs seeded');

    // Seed testimonials
    const testimonials = [
      { reviewer_name: 'Esther Howard', reviewer_role: 'Web Designer', reviewer_image: 'assets/img/reviewer-1.png', review_text: 'Climb it see the world, not so the world can see you. This is due to their excellent service. They are a seamless team to work with.', rating: 4.9 },
      { reviewer_name: 'Daniyel Karlos', reviewer_role: 'Web Designer', reviewer_image: 'assets/img/reviewer-2.png', review_text: 'Climb it see the world, not so the world can see you. This is due to their excellent service. They are a seamless team to work with.', rating: 4.8 },
    ];
    for (const t of testimonials) {
      await pool.query(
        'INSERT INTO testimonials (reviewer_name, reviewer_role, reviewer_image, review_text, rating) VALUES ($1,$2,$3,$4,$5)',
        [t.reviewer_name, t.reviewer_role, t.reviewer_image, t.review_text, t.rating]
      );
    }
    console.log('Testimonials seeded');

    console.log('\nDatabase seeded successfully!');
    console.log('Admin login: admin / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
