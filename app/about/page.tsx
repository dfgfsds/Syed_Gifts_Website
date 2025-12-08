import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('img/la-about-us.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Story
            </h1>
            <p className="text-xl text-white/90">
              Committed to sustainability, driven by passion
            </p>
          </div>
        </div> */}
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-[#F8F7F2]">
        <div className="container mx-auto px-4">
          <p className='max-w-3xl text-center mx-auto'>
            At Syed Gifts, our purpose is to bring joy and meaning to every gifting experience.
            We exist to help people express love, gratitude, and celebration through thoughtful, personalized gifts that create lasting memories.

            From birthdays and weddings to corporate events, we specialize in unique, high-quality products that bring joy to every occasion.
            With a focus on creativity, craftsmanship, and customer satisfaction, our team ensures every package that leaves our workshop is more than just a gift — it’s a memory.

          </p>
          <div className="max-w-3xl mx-auto text-center">
            <span>
              <h2 className="text-3xl font-bold mb-6 mt-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Gifting made personal, meaningful, and beautiful — that’s the Syed Gifts promise
              </p>
            </span>
            <span>
              <h2 className="text-3xl font-bold mb-6">Value</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We believe true value lies not in the price of a gift, but in the emotion it carries
              </p>
            </span>

          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-20 bg-[#F8F7F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "https://media.licdn.com/dms/image/v2/D5603AQFMyF92QZ6Tcg/profile-displayphoto-shrink_200_200/B56ZYrM8ohH0Ac-/0/1744481537398?e=2147483647&v=beta&t=dpF6LUU_Wg5m8gzUblgUlF1tBJCAKAZdzPzEQUXJxQ4"
              },
              {
                name: "Michael Chen",
                role: "Head of Sustainability",
                image: "https://media.licdn.com/dms/image/v2/D5603AQFMyF92QZ6Tcg/profile-displayphoto-shrink_200_200/B56ZYrM8ohH0Ac-/0/1744481537398?e=2147483647&v=beta&t=dpF6LUU_Wg5m8gzUblgUlF1tBJCAKAZdzPzEQUXJxQ4"
              },
              {
                name: "Emma Rodriguez",
                role: "Product Curator",
                image: "https://media.licdn.com/dms/image/v2/D5603AQFMyF92QZ6Tcg/profile-displayphoto-shrink_200_200/B56ZYrM8ohH0Ac-/0/1744481537398?e=2147483647&v=beta&t=dpF6LUU_Wg5m8gzUblgUlF1tBJCAKAZdzPzEQUXJxQ4"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to spread joy? Explore our unique collection of gifts and join the Syed Gifts community celebrating every occasion with love and thoughtfulness.
            </p>
            <Button asChild size="lg" className="bg-[#4D8B31] hover:bg-[#3e7026]">
              <Link href="/products">
                Shop Our Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}