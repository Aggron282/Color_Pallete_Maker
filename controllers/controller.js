const path = require("path");
const rootDir = path.dirname(require.main.filename);
const color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt");
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");
const { validationResult } = require("express-validator");

// Utility function to render views safely
const renderPage = (res, viewPath, data = {}) => {
    try {
        res.render(path.join(rootDir, "views", ...viewPath.split("/")), data);
    } catch (error) {
        console.error(`Error rendering ${viewPath}:`, error);
        res.status(500).send("Server error.");
    }
};

// 🎨 Get Palette Detail Page
const GetPalleteDetailPage = async (req, res) => {
    try {
        const pallete_id = req.params.pallete;
        my_sequelize_util.findOnePallete(req.user.user_id, pallete_id, async (pallete) => {
            if (!pallete) return res.status(404).send("Palette not found.");

            const configuredPallete = await color_util.ConfigurePallete(pallete);
            renderPage(res, "user/detail.ejs", {
                pallete: configuredPallete,
                path: '/detail',
                user: req.user,
                pallete_id: pallete.pallete_id
            });
        });
    } catch (error) {
        console.error("Error fetching palette details:", error);
        res.status(500).send("Error loading page.");
    }
};

// 🏠 Main Page
const GetMainPage = (req, res) => renderPage(res, "index.ejs");

// 📂 Category Page
const GetAllInCategoryPage = async (req, res) => {
    try {
        const category = req.params.category;
        my_sequelize_util.findUsercategoryPalletes(req.user.user_id, category, async (colors) => {
            const all_palletes_in_category = await color_util.ConfigurePalletes(colors);
            renderPage(res, "user/all_in_category.ejs", {
                category,
                user: req.user,
                path: req.url,
                all_palletes_in_category
            });
        });
    } catch (error) {
        console.error("Error fetching category palettes:", error);
        res.status(500).send("Error loading category page.");
    }
};

// 👤 Profile Page
const GetProfilePage = (req, res) => renderPage(res, "user/profile.ejs", { user: req.user, path: "/profile" });

// 🔑 Login Page
const GetLoginPage = (req, res) => renderPage(res, "auth/login.ejs");

// 🆕 Create Account Page
const GetCreateAccountPage = (req, res) => renderPage(res, "auth/create_account.ejs");

// 📊 Dashboard Page
async function GetDashboardPage(req, res) {
  try {
   console.log(req.session)
    // if (!req.session || !req.session.user_id) {
    //   return res.status(401).json({ error: "User not authenticated" });
    // }

    const userId = req.session.user_id;

     await my_sequelize_util.findUser(req.session.user.username,(user)=>{
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      renderPage(res, "user/dashboard.ejs", { user: req.user, path: "/dashboard", pallete: null })
    });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
}


// ➕ Add Palette Page
const GetAddPage = (req, res) => renderPage(res, "user/add.ejs", { user: req.user, path: "/add", pallete: null });

// 🎇 Particle Maker Page
const GetParticleMakerPage = (req, res) => renderPage(res, "user/particle.ejs", { user: req.user, path: "/particle_maker", pallete: null });

// 🎨 Color Converter Page
const GetConverterPage = (req, res) => renderPage(res, "user/converter.ejs", { user: req.user, path: "/converter", pallete: null });

// 🤖 AI Page
const GetAIPage = (req, res) => renderPage(res, "user/ai.ejs", { user: req.user, path: "/ai", pallete: null });

// 🔄 Export Functions
module.exports = {
    GetAIPage,
    GetConverterPage,
    GetParticleMakerPage,
    GetPalleteDetailPage,
    GetAllInCategoryPage,
    GetCreateAccountPage,
    GetAddPage,
    GetDashboardPage,
    GetMainPage,
    GetLoginPage,
    GetProfilePage
};
