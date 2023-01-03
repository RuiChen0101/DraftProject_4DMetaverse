import 'package:flutter/material.dart';
import 'package:fourdmetaverse_app/component/bottom_nav_bar/bottom_nav_bar_item.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void changeSelect(int index) {
    setState(() {
      _currentIndex = index;
      _pageController.animateToPage(index,
          duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        automaticallyImplyLeading: false,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              width: 28,
            ),
            const SizedBox(
              width: 4,
            ),
            const Text(
              "4DMetaverse",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SizedBox.expand(
        child: PageView(
          physics: const NeverScrollableScrollPhysics(),
          controller: _pageController,
          children: [
            Container(),
            Container(),
            Container(),
            Container(),
            Container(),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.white,
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            BottomNavBarItem(
              onTabClick: () => changeSelect(0),
              isDisplay: _currentIndex == 0,
              icon: Icons.home_outlined,
              text: 'Home',
            ),
            BottomNavBarItem(
              onTabClick: () => changeSelect(1),
              isDisplay: _currentIndex == 1,
              icon: Icons.search,
              text: 'Search',
            ),
            BottomNavBarItem(
              onTabClick: () => changeSelect(2),
              icon: Icons.inventory_2_outlined,
              isDisplay: _currentIndex == 2,
              text: 'Collection',
            ),
            BottomNavBarItem(
              onTabClick: () => changeSelect(3),
              isDisplay: _currentIndex == 3,
              icon: Icons.monitor,
              text: 'Devices',
            ),
            BottomNavBarItem(
              onTabClick: () => changeSelect(4),
              isDisplay: _currentIndex == 4,
              icon: Icons.person_outline,
              text: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
