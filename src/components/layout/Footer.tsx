import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CONTACT_EMAIL } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container max-w-7xl py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="grid gap-2">
              <Link to="/" className="text-sm hover:underline">
                Home
              </Link>
            </nav>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Our Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>1720 SW 37th Street</p>
                <p>Gainesville, FL 32607</p>
                <p>Email: {CONTACT_EMAIL}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} TAPS Toolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
